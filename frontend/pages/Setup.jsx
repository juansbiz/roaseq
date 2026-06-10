import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

const STEPS = [
  { id: 1, title: "Welcome", description: "Get started with ROASEQ" },
  { id: 2, title: "Database", description: "Where should we store your data?" },
  { id: 3, title: "Admin user", description: "Create your admin account" },
  { id: 4, title: "AI provider", description: "Connect your AI for insights" },
  { id: 5, title: "First store", description: "Connect your first store" },
];

export default function Setup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step state
  const [databaseConfig, setDatabaseConfig] = useState({ type: "bundled", databaseUrl: "" });
  const [adminConfig, setAdminConfig] = useState({ email: "", password: "", confirmPassword: "" });
  const [aiConfig, setAiConfig] = useState({ provider: "skip", config: {} });
  const [storeConfig, setStoreConfig] = useState({ type: "skip", config: {} });

  useEffect(() => {
    document.title = `ROASEQ Setup - Step ${currentStep} of 5`;
  }, [currentStep]);

  const handleNext = () => {
    setError(null);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDatabaseSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/setup/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(databaseConfig),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Database setup failed");
      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async () => {
    if (adminConfig.password !== adminConfig.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (adminConfig.password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/setup/admin-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminConfig.email, password: adminConfig.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Admin user creation failed");
      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/setup/ai-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiConfig),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI provider setup failed");
      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/setup/first-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeConfig),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Store connection failed");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="ROASEQ Setup" description="First-run setup wizard" />
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={
                    "flex-1 text-center text-xs " +
                    (step.id === currentStep
                      ? "text-[#f2ff00] font-bold"
                      : step.id < currentStep
                      ? "text-gray-500"
                      : "text-gray-700")
                  }
                >
                  {step.id}
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-800 rounded">
              <div
                className="h-full bg-[#f2ff00] rounded transition-all"
                style={{ width: (currentStep / 5) * 100 + "%" }}
              />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 p-8">
            <h1 className="text-3xl font-bold mb-2">
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </h1>
            <p className="text-gray-400 mb-6">{STEPS[currentStep - 1].description}</p>

            {error && (
              <div className="mb-4 p-3 border border-red-500 bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}

            {currentStep === 1 && <Step1Welcome onNext={handleNext} />}
            {currentStep === 2 && (
              <Step2Database
                config={databaseConfig}
                setConfig={setDatabaseConfig}
                onSubmit={handleDatabaseSubmit}
                loading={loading}
              />
            )}
            {currentStep === 3 && (
              <Step3AdminUser
                config={adminConfig}
                setConfig={setAdminConfig}
                onSubmit={handleAdminSubmit}
                loading={loading}
              />
            )}
            {currentStep === 4 && (
              <Step4AIProvider
                config={aiConfig}
                setConfig={setAiConfig}
                onSubmit={handleAiSubmit}
                loading={loading}
              />
            )}
            {currentStep === 5 && (
              <Step5FirstStore
                config={storeConfig}
                setConfig={setStoreConfig}
                onSubmit={handleStoreSubmit}
                loading={loading}
              />
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
                className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {currentStep === 1 && (
                <button
                  onClick={handleNext}
                  className="bg-[#f2ff00] text-black px-6 py-3 font-bold hover:bg-[#e6e600]"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Step1Welcome(props) {
  return (
    <div className="space-y-4">
      <p className="text-lg">Welcome to ROASEQ. Let's get you set up.</p>
      <p className="text-gray-400">
        This takes about 5 minutes. You can skip steps and configure later in Settings.
      </p>
      <ul className="space-y-2 text-gray-300 list-disc list-inside">
        <li>Choose your database (bundled or your own)</li>
        <li>Create your admin account</li>
        <li>Connect your AI provider (optional)</li>
        <li>Connect your first store (optional)</li>
      </ul>
      <p className="text-sm text-gray-500 mt-6">
        The wizard works offline. It does not call home. It does not require an account at the marketing site.
      </p>
    </div>
  );
}

function Step2Database(props) {
  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="db-type"
          value="bundled"
          checked={props.config.type === "bundled"}
          onChange={(e) => props.setConfig({ ...props.config, type: e.target.value })}
          className="mt-1"
        />
        <div>
          <div className="font-bold">Use the bundled Postgres (default)</div>
          <div className="text-sm text-gray-400">
            Recommended for most setups. Runs in the docker-compose stack.
          </div>
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="db-type"
          value="external"
          checked={props.config.type === "external"}
          onChange={(e) => props.setConfig({ ...props.config, type: e.target.value })}
          className="mt-1"
        />
        <div>
          <div className="font-bold">Use my own Postgres</div>
          <div className="text-sm text-gray-400">
            I'll provide a DATABASE_URL. Use this for production or managed Postgres.
          </div>
          {props.config.type === "external" && (
            <input
              type="text"
              placeholder="postgres://user:pass@host:5432/db"
              value={props.config.databaseUrl}
              onChange={(e) => props.setConfig({ ...props.config, databaseUrl: e.target.value })}
              className="mt-2 w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm font-mono"
            />
          )}
        </div>
      </label>

      <button
        onClick={props.onSubmit}
        disabled={props.loading || (props.config.type === "external" && !props.config.databaseUrl)}
        className="w-full bg-[#f2ff00] text-black px-6 py-3 font-bold hover:bg-[#e6e600] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {props.loading ? "Verifying..." : "Continue"}
      </button>
    </div>
  );
}

function Step3AdminUser(props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={props.config.email}
          onChange={(e) => props.setConfig({ ...props.config, email: e.target.value })}
          className="w-full bg-[#101010] border border-gray-700 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          value={props.config.password}
          onChange={(e) => props.setConfig({ ...props.config, password: e.target.value })}
          className="w-full bg-[#101010] border border-gray-700 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Confirm password</label>
        <input
          type="password"
          value={props.config.confirmPassword}
          onChange={(e) => props.setConfig({ ...props.config, confirmPassword: e.target.value })}
          className="w-full bg-[#101010] border border-gray-700 px-3 py-2"
        />
      </div>
      <p className="text-xs text-gray-500">Password must be 12+ characters.</p>

      <button
        onClick={props.onSubmit}
        disabled={props.loading || !props.config.email || !props.config.password || !props.config.confirmPassword}
        className="w-full bg-[#f2ff00] text-black px-6 py-3 font-bold hover:bg-[#e6e600] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {props.loading ? "Creating..." : "Continue"}
      </button>
    </div>
  );
}

function Step4AIProvider(props) {
  const [apiKey, setApiKey] = useState(props.config.config.apiKey || "");
  const [baseUrl, setBaseUrl] = useState(props.config.config.baseUrl || "");
  const [accessKey, setAccessKey] = useState(props.config.config.accessKey || "");
  const [secretKey, setSecretKey] = useState(props.config.config.secretKey || "");
  const [region, setRegion] = useState(props.config.config.region || "us-east-1");

  const handleProviderChange = (provider) => {
    props.setConfig({ provider, config: { apiKey, baseUrl, accessKey, secretKey, region } });
  };

  const handleSubmit = () => {
    props.setConfig({
      provider: props.config.provider,
      config: { apiKey, baseUrl, accessKey, secretKey, region },
    });
    props.onSubmit();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Connect your AI provider. Used for attribution model selection and natural-language insights.
        Skip if you don't need AI features.
      </p>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="openai"
          checked={props.config.provider === "openai"}
          onChange={() => handleProviderChange("openai")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">OpenAI</div>
          {props.config.provider === "openai" && (
            <input
              type="password"
              placeholder="API key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-2 w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm"
            />
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="anthropic"
          checked={props.config.provider === "anthropic"}
          onChange={() => handleProviderChange("anthropic")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">Anthropic</div>
          {props.config.provider === "anthropic" && (
            <input
              type="password"
              placeholder="API key (sk-ant-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-2 w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm"
            />
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="bedrock"
          checked={props.config.provider === "bedrock"}
          onChange={() => handleProviderChange("bedrock")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">AWS Bedrock</div>
          {props.config.provider === "bedrock" && (
            <div className="mt-2 space-y-2">
              <input type="text" placeholder="Access key (AKIA...)" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="password" placeholder="Secret key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="text" placeholder="Region (us-east-1)" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="ollama"
          checked={props.config.provider === "ollama"}
          onChange={() => handleProviderChange("ollama")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">Ollama (self-hosted)</div>
          {props.config.provider === "ollama" && (
            <input
              type="text"
              placeholder="Base URL (http://localhost:11434)"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mt-2 w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm"
            />
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="openai-compatible"
          checked={props.config.provider === "openai-compatible"}
          onChange={() => handleProviderChange("openai-compatible")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">OpenAI-compatible (MiniMax, Groq, etc.)</div>
          {props.config.provider === "openai-compatible" && (
            <div className="mt-2 space-y-2">
              <input type="text" placeholder="Base URL (https://api.example.com)" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="password" placeholder="API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="ai-provider"
          value="skip"
          checked={props.config.provider === "skip"}
          onChange={() => handleProviderChange("skip")}
          className="mt-1"
        />
        <div>
          <div className="font-bold">Skip for now</div>
          <div className="text-sm text-gray-400">
            The app works without AI. Configure later in Settings.
          </div>
        </div>
      </label>

      <button
        onClick={handleSubmit}
        disabled={props.loading}
        className="w-full bg-[#f2ff00] text-black px-6 py-3 font-bold hover:bg-[#e6e600] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {props.loading ? "Testing..." : "Continue"}
      </button>
    </div>
  );
}

function Step5FirstStore(props) {
  const [shopDomain, setShopDomain] = useState(props.config.config.shopDomain || "");
  const [storeUrl, setStoreUrl] = useState(props.config.config.storeUrl || "");
  const [consumerKey, setConsumerKey] = useState(props.config.config.consumerKey || "");
  const [consumerSecret, setConsumerSecret] = useState(props.config.config.consumerSecret || "");
  const [storeHash, setStoreHash] = useState(props.config.config.storeHash || "");
  const [accessToken, setAccessToken] = useState(props.config.config.accessToken || "");

  const handleTypeChange = (type) => {
    props.setConfig({
      type,
      config: { shopDomain, storeUrl, consumerKey, consumerSecret, storeHash, accessToken },
    });
  };

  const handleSubmit = () => {
    props.setConfig({
      type: props.config.type,
      config: { shopDomain, storeUrl, consumerKey, consumerSecret, storeHash, accessToken },
    });
    props.onSubmit();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Connect your first store. You can add more stores later in Settings.
      </p>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="store-type"
          value="shopify"
          checked={props.config.type === "shopify"}
          onChange={() => handleTypeChange("shopify")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">Shopify</div>
          {props.config.type === "shopify" && (
            <input
              type="text"
              placeholder="yourstore.myshopify.com"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              className="mt-2 w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm"
            />
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="store-type"
          value="woocommerce"
          checked={props.config.type === "woocommerce"}
          onChange={() => handleTypeChange("woocommerce")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">WooCommerce</div>
          {props.config.type === "woocommerce" && (
            <div className="mt-2 space-y-2">
              <input type="text" placeholder="Store URL" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="text" placeholder="Consumer key (ck_...)" value={consumerKey} onChange={(e) => setConsumerKey(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="password" placeholder="Consumer secret (cs_...)" value={consumerSecret} onChange={(e) => setConsumerSecret(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="store-type"
          value="bigcommerce"
          checked={props.config.type === "bigcommerce"}
          onChange={() => handleTypeChange("bigcommerce")}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-bold">BigCommerce</div>
          {props.config.type === "bigcommerce" && (
            <div className="mt-2 space-y-2">
              <input type="text" placeholder="Store hash (abc123)" value={storeHash} onChange={(e) => setStoreHash(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
              <input type="password" placeholder="Access token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="w-full bg-[#101010] border border-gray-700 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="store-type"
          value="skip"
          checked={props.config.type === "skip"}
          onChange={() => handleTypeChange("skip")}
          className="mt-1"
        />
        <div>
          <div className="font-bold">Skip for now</div>
          <div className="text-sm text-gray-400">
            You can add stores later in Settings.
          </div>
        </div>
      </label>

      <button
        onClick={handleSubmit}
        disabled={props.loading}
        className="w-full bg-[#f2ff00] text-black px-6 py-3 font-bold hover:bg-[#e6e600] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {props.loading ? "Connecting..." : "Finish setup"}
      </button>
    </div>
  );
}
