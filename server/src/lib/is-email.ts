// Email address matcher.
const matcher = /.+\@.+\..+/

/**
 * Loosely validate an email address.
 * @param {string} string
 * @return {boolean}
 */
export function isEmail(value: string): boolean {
  return matcher.test(value)
}
