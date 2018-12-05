import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import resolvers from './resolvers'
import typeDefs from './schema'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // enable introspection in production mode
  introspection: true
})

export default function applyGraphQLMiddleware(app: Express): void {
  server.applyMiddleware({ app, path: '/graphql' })
}
