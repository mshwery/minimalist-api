/**
 * @overview adds async/await exception support to express Router or App methods
 * Prevents `UnhandledPromiseRejectionWarning` that gets swallowed, also prevents them from killing the process
 * This works for both async request *and* error middleware
 * Must be `require`d before any routes are defined that rely on it
 *
 * Note: this monkey-patches express methods (tsk tsk)
 */
const Layer = require('express/lib/router/layer')

Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get () {
    return this.__handle
  },
  set (fn) {
    this.__handle = wrap(fn)
  }
})

function wrap (fn) {
  if (fn.length <= 3) {
    return (req, res, next) => {
      return Promise.resolve(fn(req, res, next)).catch(next)
    }
  } else {
    return (error, req, res, next) => {
      return Promise.resolve(fn(error, req, res, next)).catch(next)
    }
  }
}
