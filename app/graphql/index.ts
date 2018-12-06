import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import resolvers from './resolvers'
import typeDefs from './schema'
import { verifyJwt } from '../lib/auth'

const path = '/graphql'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // enable introspection in production mode
  introspection: true,
  context: ({ req }) => ({
    // TODO: enrich with other user data
    viewer: req.user ? req.user.sub : undefined
  })
})

export default function applyGraphQLMiddleware(app: Express): void {
  // check jwt token beforehand
  app.use(path, verifyJwt)
  server.applyMiddleware({ app, path })
}
