const proxy = require('http-proxy-middleware')
const package = require('../package.json')

module.exports = function(app) {
  app.use(proxy([
    '/api',
    '/connect',
    '/graphql'
  ], { target: package.proxy }))
}
