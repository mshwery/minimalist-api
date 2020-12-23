/**
 * @overview server entrypoint
 */

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import passport from 'passport'
import { Connection } from 'typeorm'
import * as Sentry from '@sentry/node'
import config from '../config'
import restApi from './rest'
import applyGraphQLMiddleware from './graphql'
import handleErrorResponse from './middleware/errors'
import handleNotFound from './middleware/not-found'
import logger from './lib/logger'
import initConnection from './lib/database'
import { verifyJwtMiddleware } from './lib/auth'
import passportRouter from './passport'

Sentry.init({
  environment: config.get('ENV'),
  dsn: config.get('SENTRY_DSN'),
})

const app = express()
const port = config.get('PORT') || 3000
app.set('port', port)

/** Provide access to request.ips = [x-forwarded-for headers] */
app.enable('trust proxy')

/** The request handler must be the first middleware on the app */
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)

/** node security modules */
app.use(helmet())

/** accept json */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/** parse cookies */
app.use(cookieParser())

/** basic health endpoint */
app.get('/health', (_req, res) => res.end())

/** setup passport for authentication */
app.use(passport.initialize())

/** Check for jwt authorization (either in header or cookie, see `getToken`) */
app.use(verifyJwtMiddleware)

app.use(passportRouter)

/** api route handlers */
app.use('/api', cors(), restApi)

/** graphql server (applies middleware) */
applyGraphQLMiddleware(app)

// In dev mode, let create-react-app serve the proxy for the client-side app
if (config.get('NODE_ENV') === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../../web/build')))

  // Handle React routing, return all requests to React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../web/build', 'index.html'))
  })
}

/** 404 handler – note this only works for non-`get` requests in production due to the React app handling wildcard route ^ */
app.use(handleNotFound)

/** The error handler must be before any other error middleware */
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

/** global error catch-all */
app.use(handleErrorResponse)

let connection: Connection

function gracefulShutdown(exitCode: number = 1) {
  const promise = connection ? connection.close() : Promise.resolve()

  promise
    .then(() => {
      process.exit(exitCode)
    })
    .catch((err) => {
      logger.error('😱 Failed to close db connection.', err)
      process.exit(1)
    })

  // Forceful shutdown if graceful shutdown fails, before docker kills it
  setTimeout(() => {
    logger.crit('Forcibly shutting down')
    process.exit(1)
  }, 8000)
}

/** start the server */
initConnection()
  .then((conn) => {
    connection = conn

    app.listen(port, () => {
      logger.info(`🚀 Server ready at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    logger.crit('😱 The server failed to initialize the db connection!', err)
    gracefulShutdown()
  })

process.on('uncaughtException', (err) => {
  logger.crit('😱 The server crashed from an uncaught exception!', err)
  gracefulShutdown()
})

process.on('unhandledRejection', (reason, _promise) => {
  logger.crit('😱 The server crashed from an unhandled rejection!', reason)
  gracefulShutdown()
})

// Termination signal sent by Docker on stop
process.on('SIGTERM', () => {
  gracefulShutdown(0)
})

// Interrupt signal sent by Ctrl+C
process.on('SIGINT', () => {
  gracefulShutdown(0)
})
