import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import schema from './schema'
import formatError from './formatError'
import { verifyJwt } from '../lib/auth'

const path = '/graphql'

function context({ req }) {
  return {
    // TODO: enrich with other user data
    viewer: req.user ? req.user.sub : undefined
  }
}

const server = new ApolloServer({
  schema,
  context,
  formatError,
  // enable introspection (in production mode, too)
  introspection: true
})

export default function applyGraphQLMiddleware(app: Express): void {
  // check jwt token beforehand
  app.use(path, verifyJwt)
  server.applyMiddleware({ app, path })
}
