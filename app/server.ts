/**
 * @overview server entrypoint
 */

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import { Connection } from 'typeorm'
import config from '../config'
import restApi from './rest'
import applyGraphQLMiddleware from './graphql'
import handleErrorResponse from './middleware/errors'
import handleNotFound from './middleware/not-found'
import logger from './lib/logger'
import initConnection from './lib/database'
import { verifyJwt } from './lib/auth'

const app = express()
const port = config.get('PORT') || 3000
app.set('port', port)

/** Provide access to request.ips = [x-forwarded-for headers] */
app.enable('trust proxy')

/** node security modules */
app.use(helmet())

/** accept json */
app.use(bodyParser.json())

/** basic health endpoint */
app.get('/health', (_req, res) => res.end())

/** api route handlers */
app.use('/api/v1', cors(), verifyJwt, restApi)

/** graphql server (applies middleware) */
applyGraphQLMiddleware(app)

// In dev mode, let create-react-app serve the proxy for the client-side app
if (config.get('NODE_ENV') === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'))
  })
}

/** 404 handler */
app.use(handleNotFound)

/** global error catch-all */
app.use(handleErrorResponse)

let connection: Connection

function gracefulShutdown(exitCode: number = 1) {
  const promise = connection ? connection.close() : Promise.resolve()

  promise
    .then(() => {
      process.exit(exitCode)
    })
    .catch(err => {
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
  .then(conn => {
    connection = conn

    app.listen(port, err => {
      if (err) {
        logger.error(err)
        return
      }

      logger.info(`🚀 Server ready at http://localhost:${port}`)
    })
  })
  .catch(err => {
    logger.crit('😱 The server failed to initialize the db connection!', err)
    gracefulShutdown()
  })

process.on('uncaughtException', err => {
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
