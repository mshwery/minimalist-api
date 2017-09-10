/**
 * @overview async handler for express
 */

module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
}
