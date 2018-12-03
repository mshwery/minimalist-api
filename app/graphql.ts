import { ApolloServer, gql } from 'apollo-server-express'
import { Express } from 'express'

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // enable introspection in production mode
  introspection: true
})

export default async function applyGraphQLMiddleware(app: Express): Promise<void> {
  await server.applyMiddleware({ app, path: '/graphql' })
}
