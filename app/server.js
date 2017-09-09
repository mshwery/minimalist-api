/**
 * @overview server entrypoint
 */

'use strict'

const express = require('express')
const helmet = require('helmet')
const config = require('../config')
const routes = require('./routes')
const { handleNotFound } = require('./lib/errors')

const app = express()
const host = process.env.HOST || null
const port = config.get('PORT') || 3000
app.set('port', port)

/** Provide access to request.ips = [x-forwarded-for headers] */
app.enable('trust proxy')

/** node security modules */
app.use(helmet())

/** basic health endpoint */
app.get('/health', (req, res) => res.end())

/** api routes */
app.use('/', routes)

/** 404 handler */
app.use(handleNotFound)

/** start the server */
app.listen(app.get('port'), host, (err) => {
  if (err) {
    return console.error(err)
  }

  console.info(`Server is ready and listening on http://${host || 'localhost'}:${app.get('port')}`)
})
