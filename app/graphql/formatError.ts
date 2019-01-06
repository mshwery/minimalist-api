import { ApolloError, UserInputError, toApolloError } from 'apollo-server-express'
import { get } from 'lodash'
import logger from '../lib/logger'
import config from '../../config'

/** Converts http status codes into Apollo-style error codes */
function toApolloErrorCode(status: number): string | undefined {
  switch (status) {
    case 400:
      return 'BAD_USER_INPUT'
    case 401:
      return 'UNAUTHENTICATED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 409:
      return 'CONFLICT'
    default:
      return undefined
  }
}

export default function formatError(error): Error {
  logger.error(error)

  // Remove exception information in production mode
  if (config.get('NODE_ENV') === 'production') {
    delete error.extensions.exception
  }

  // Only explicitly exposable errors should be returned as-is
  const canExposeError = get(error, 'originalError.expose', false)
  if (canExposeError) {
    // Handle validation errors separately, so we can optimize the presentation through Apollo
    const validationErrors = get(error, 'originalError.validationErrors')
    if (Array.isArray(validationErrors) && validationErrors.length) {
      return new UserInputError(error.message, { validationErrors })
    }

    const status = get(error, 'originalError.status')
    // Adorn error with an appropriate "code" so Apollo doesn't return all error types as "INTERNAL_SERVER_ERROR"
    return toApolloError(error, toApolloErrorCode(status))
  }

  // Otherwise return a generic Apollo error
  return new ApolloError('Internal server error')
}
