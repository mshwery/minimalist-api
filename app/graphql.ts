import { ApolloServer, gql } from 'apollo-server-express'
import { Express } from 'express'
import resolvers from './resolvers'

const typeDefs = gql`
  type Query {
    lists: [List]
    list(id: String!): List
  }

  type List {
    # TODO: use UUID type
    id: String!
    # The name of the list
    name: String!
    # Whether or not the list is archived
    isArchived: Boolean!
    # The user id who created the list
    createdBy: String
    # When the list was created
    # TODO: ISO 8601 DateTime
    createdAt: String
    # When the list was last updated
    # TODO: ISO 8601 DateTime
    updatedAt: String
    # When the list was archived, null if not archived
    # TODO: ISO 8601 DateTime
    archivedAt: String
  }

  type Task {
    # TODO: use UUID type
    id: String!
    # The content of the task
    content: String!
    # Whether or not the task is marked as complete
    isCompleted: Boolean!
    # The associated list this task belongs to
    listId: String
    # The user id who created the task
    createdBy: String
    # When the task was created
    # TODO: ISO 8601 DateTime
    createdAt: String
    # When the task was last updated
    # TODO: ISO 8601 DateTime
    updatedAt: String
    # When the task was completed, null if not completed
    # TODO: ISO 8601 DateTime
    completedAt: String
  }

  type User {
    # TODO: use UUID type
    id: String!
    # The user's email address
    email: String!
    # When the task was created
    # TODO: ISO 8601 DateTime
    createdAt: String
    # When the task was last updated
    # TODO: ISO 8601 DateTime
    updatedAt: String
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // enable introspection in production mode
  introspection: true
})

export default function applyGraphQLMiddleware(app: Express): void {
  server.applyMiddleware({ app, path: '/graphql' })
}
