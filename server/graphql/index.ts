import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import schema from './schema'
import formatError from './formatError'
import requireAuthentication from '../middleware/require-authentication'
import config from '../../config'

function context({ req }) {
  return {
    // TODO: enrich with other user data
    viewer: req.jwt ? req.jwt.sub : undefined
  }
}

const server = new ApolloServer({
  schema,
  context,
  formatError,
  // enable introspection (in production mode, too)
  introspection: true,
  tracing: true,
  engine:
    config.get('NODE_ENV') === 'production'
      ? {
          graphVariant: 'current',
          reportSchema: true
        }
      : undefined
})

export default function applyGraphQLMiddleware(app: Express): void {
  // For now we'll require all graphql queries be authenticated. Use rest to get an auth token.
  app.use('/graphql', requireAuthentication)
  server.applyMiddleware({
    app,
    cors: true,
    path: '/graphql'
  })
}
