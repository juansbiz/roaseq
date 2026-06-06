import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import authRoutes from './src/backend/routes/auth.js'
import crmRoutes from './src/backend/routes/crm.js'
import cache from './src/backend/services/cache.js'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'
const STRIPE_SECRET_KEY = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY

console.log(`[ROASEQ] Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)
console.log(`[ROASEQ] Stripe Mode: ${STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`)

const stripe = new Stripe(STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
})

const app = express()
const PORT = process.env.PORT || 3007

app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3012',
  credentials: true,
}))
app.use(helmet({
  contentSecurityPolicy: false,
}))

if (!isProduction) {
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`)
    })
    next()
  })
}

app.use(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json', limit: '10mb' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']
    const host = (req.headers.host || '').split(':')[0]
    const webhookSecret = (host === 'roaseq.com' || host === 'www.roaseq.com')
      ? process.env.STRIPE_WEBHOOK_SECRET_PROD
      : process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
      res.status(400).json({ error: 'Missing stripe signature or webhook secret' })
      return
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret)
    } catch (err) {
      res.status(400).json({ error: `Webhook Error: ${(err as Error).message}` })
      return
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('[Webhook] Checkout completed:', event.data.object.id)
          break
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          console.log(`[Webhook] Subscription ${event.type}:`, event.data.object.id)
          break
        }
        case 'customer.subscription.deleted': {
          console.log('[Webhook] Subscription deleted:', event.data.object.id)
          break
        }
        case 'invoice.payment_succeeded': {
          console.log('[Webhook] Payment succeeded:', event.data.object.id)
          break
        }
        case 'invoice.payment_failed': {
          console.log('[Webhook] Payment failed:', event.data.object.id)
          break
        }
        default:
          console.log(`[Webhook] Unhandled: ${event.type}`)
      }
      res.json({ received: true })
    } catch (err) {
      console.error('[Webhook] Handler error:', err)
      res.status(500).json({ error: 'Webhook handler failed' })
    }
  }
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const distPath = isProduction ? '/app/dist' : './dist'
app.use(express.static(distPath))

app.get('/api/health', async (_req, res) => {
  const cacheHealth = await cache.healthCheck()
  const cacheStats = cache.getStats()
  res.json({
    status: 'OK',
    service: 'roaseq-backend',
    timestamp: new Date().toISOString(),
    cache: { ...cacheHealth, ...cacheStats },
  })
})

app.get('/api/stripe-mode', (_req, res) => {
  const isTestMode = STRIPE_SECRET_KEY?.startsWith('sk_test_')
  res.json({
    mode: isTestMode ? 'test' : 'live',
    environment: isProduction ? 'production' : 'development',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/crm', crmRoutes)

app.get('*', (_req, res) => {
  res.sendFile(`${distPath}/index.html`)
})

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ROASEQ] Server Error:', { message: err.message, stack: err.stack, path: req.path })
  res.status(err.status || 500).json({
    error: isProduction ? 'Internal server error' : err.message,
    path: req.path,
  })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 ROASEQ server running on port ${PORT}`)
  console.log(`📡 Health: http://localhost:${PORT}/api/health`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`)
    process.exit(1)
  }
  console.error('❌ Server error:', error)
})

process.on('SIGTERM', async () => {
  console.log('[ROASEQ] SIGTERM received, shutting down gracefully...')
  server.close(async () => {
    await cache.shutdown()
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('[ROASEQ] SIGINT received, shutting down gracefully...')
  server.close(async () => {
    await cache.shutdown()
    process.exit(0)
  })
})
