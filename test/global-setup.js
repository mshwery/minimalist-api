require('ts-node/register')

// To reference other typescript modules, we must do it via require here
const { resetDb } = require('./test-db')

module.exports = async function () {
  await resetDb()
}
