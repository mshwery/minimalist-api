/**
 * @overview server entrypoint
 */

'use strict'

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const config = require('../config')
const routes = require('./routes')
const { handleNotFound, handleErrorResponse } = require('./middleware/errors')

const app = express()
const host = process.env.HOST || null
const port = config.get('PORT') || 3000
app.set('port', port)

/** Provide access to request.ips = [x-forwarded-for headers] */
app.enable('trust proxy')

/** node security modules */
app.use(helmet())

/** accept json */
app.use(bodyParser.json())

/** basic health endpoint */
app.get('/health', (req, res) => res.end())

/** api route handlers */
app.use('/api', cors(), routes)

/** 404 handler */
app.use(handleNotFound)

/** global error catch-all */
app.use(handleErrorResponse)

/** start the server */
app.listen(app.get('port'), host, (err) => {
  if (err) {
    return console.error(err)
  }

  console.info(`Server is ready and listening on http://${host || 'localhost'}:${app.get('port')}`)
})
