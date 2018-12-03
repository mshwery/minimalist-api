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

const server = new ApolloServer({ typeDefs, resolvers })

export default async function graphql(app: Express): Promise<void> {
  await server.applyMiddleware({ app, path: '/graphql' })
}
