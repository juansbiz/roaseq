-- Initial schema for ROASEQ attribution engine.
-- This migration is the FOSS subset (AGPL-3.0).
-- The cloud version has additional tables for multi-tenancy, billing, etc.

-- Users (admin account from wizard step 3)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App settings (wizard completion flags + AI provider config)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI provider config (encrypted, per-user)
CREATE TABLE IF NOT EXISTS ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,  -- 'openai', 'anthropic', 'bedrock', 'ollama', 'openai-compatible'
  config JSONB NOT NULL,  -- encrypted with SECRET_KEY
  test_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores (connected e-commerce platforms)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'shopify', 'woocommerce', 'bigcommerce'
  domain TEXT NOT NULL,
  credentials JSONB NOT NULL,  -- encrypted with SECRET_KEY
  status TEXT DEFAULT 'active',  -- 'active', 'paused', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions (for tracking active user sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_ai_providers_user_id ON ai_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_type ON stores(type);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Attribution events (the actual attribution data)
CREATE TABLE IF NOT EXISTS attribution_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,  -- 'click', 'view', 'add_to_cart', 'checkout', 'purchase', 'email_open', etc.
  customer_id TEXT,  -- hashed customer identifier
  session_id TEXT,
  touchpoint_data JSONB NOT NULL,  -- campaign, ad_set, creative, etc.
  revenue NUMERIC(10, 2),  -- for purchase events
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attribution_events_store_id ON attribution_events(store_id);
CREATE INDEX IF NOT EXISTS idx_attribution_events_event_type ON attribution_events(event_type);
CREATE INDEX IF NOT EXISTS idx_attribution_events_customer_id ON attribution_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_attribution_events_occurred_at ON attribution_events(occurred_at);

-- Attribution models (the SQL views for the 6 attribution models)
-- These are the "models" that get cherry-picked to the FOSS subset
-- Implementation: each model is a SQL view that the user can audit
CREATE OR REPLACE VIEW attribution.first_touch AS
SELECT
  store_id,
  customer_id,
  (touchpoint_data->>'campaign') AS campaign,
  (touchpoint_data->>'source') AS source,
  revenue,
  occurred_at AS conversion_at
FROM (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY occurred_at ASC) AS rn
  FROM attribution_events
  WHERE event_type = 'purchase'
) first
JOIN LATERAL (
  SELECT *
  FROM attribution_events ae2
  WHERE ae2.customer_id = first.customer_id
    AND ae2.event_type = 'click'
  ORDER BY ae2.occurred_at ASC
  LIMIT 1
) click ON true
WHERE rn = 1;

CREATE OR REPLACE VIEW attribution.last_touch AS
SELECT
  store_id,
  customer_id,
  (touchpoint_data->>'campaign') AS campaign,
  (touchpoint_data->>'source') AS source,
  revenue,
  occurred_at AS conversion_at
FROM (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY occurred_at ASC) AS rn
  FROM attribution_events
  WHERE event_type = 'purchase'
) last
JOIN LATERAL (
  SELECT *
  FROM attribution_events ae2
  WHERE ae2.customer_id = last.customer_id
    AND ae2.event_type = 'click'
  ORDER BY ae2.occurred_at DESC
  LIMIT 1
) click ON true
WHERE rn = 1;

CREATE OR REPLACE VIEW attribution.linear AS
SELECT
  store_id,
  customer_id,
  campaign,
  source,
  revenue / click_count AS attributed_revenue
FROM (
  SELECT
    p.store_id,
    p.customer_id,
    c.touchpoint_data->>'campaign' AS campaign,
    c.touchpoint_data->>'source' AS source,
    p.revenue,
    COUNT(*) OVER (PARTITION BY p.customer_id) AS click_count
  FROM attribution_events p
  JOIN attribution_events c
    ON c.customer_id = p.customer_id
    AND c.event_type = 'click'
  WHERE p.event_type = 'purchase'
) linear;

CREATE OR REPLACE VIEW attribution.time_decay AS
SELECT
  store_id,
  customer_id,
  campaign,
  source,
  revenue * EXP(-0.1 * EXTRACT(EPOCH FROM (conversion_at - click_at)) / 86400) AS attributed_revenue
FROM (
  SELECT
    p.store_id,
    p.customer_id,
    c.touchpoint_data->>'campaign' AS campaign,
    c.touchpoint_data->>'source' AS source,
    p.revenue,
    p.occurred_at AS conversion_at,
    c.occurred_at AS click_at
  FROM attribution_events p
  JOIN attribution_events c
    ON c.customer_id = p.customer_id
    AND c.event_type = 'click'
    AND c.occurred_at <= p.occurred_at
  WHERE p.event_type = 'purchase'
) td;

CREATE OR REPLACE VIEW attribution.position_based AS
SELECT
  store_id,
  customer_id,
  campaign,
  source,
  CASE
    WHEN rn = 1 OR rn = max_rn THEN revenue * 0.4
    ELSE revenue * 0.2 / (max_rn - 2)
  END AS attributed_revenue
FROM (
  SELECT
    p.store_id,
    p.customer_id,
    c.touchpoint_data->>'campaign' AS campaign,
    c.touchpoint_data->>'source' AS source,
    p.revenue,
    ROW_NUMBER() OVER (PARTITION BY p.customer_id ORDER BY c.occurred_at ASC) AS rn,
    COUNT(*) OVER (PARTITION BY p.customer_id) AS max_rn
  FROM attribution_events p
  JOIN attribution_events c
    ON c.customer_id = p.customer_id
    AND c.event_type = 'click'
  WHERE p.event_type = 'purchase'
) pb;

CREATE OR REPLACE VIEW attribution.data_driven AS
-- Shapley value approximation: equal credit to all touchpoints
-- (Production would use Monte Carlo simulation; this is the FOSS-friendly approximation)
SELECT
  store_id,
  customer_id,
  campaign,
  source,
  revenue / touchpoint_count AS attributed_revenue
FROM (
  SELECT
    p.store_id,
    p.customer_id,
    c.touchpoint_data->>'campaign' AS campaign,
    c.touchpoint_data->>'source' AS source,
    p.revenue,
    COUNT(*) OVER (PARTITION BY p.customer_id) AS touchpoint_count
  FROM attribution_events p
  JOIN attribution_events c
    ON c.customer_id = p.customer_id
    AND c.event_type = 'click'
  WHERE p.event_type = 'purchase'
) dd;

-- Initial setup status: not complete
INSERT INTO app_settings (key, value, updated_at)
VALUES ('setup_complete', 'false'::jsonb, NOW())
ON CONFLICT (key) DO NOTHING;
