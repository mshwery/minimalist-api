/**
 * @overview authentication / encryption utils
 */

const bcrypt = require('bcrypt')

async function comparePassword (password, hash) {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    // @todo log
    return false
  }
}

async function hashPassword (password) {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

module.exports = {
  comparePassword,
  hashPassword
}
