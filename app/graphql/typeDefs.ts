import { gql } from 'apollo-server-express'
import { typeDef as Auth } from './auth'
import { typeDef as List } from './list'
import { typeDef as Task } from './task'
import { typeDef as User } from './user'

const schema = gql`
  schema {
    query: Query
    mutation: Mutation
  }

  # Root Query and Mutation defined so they can be extended in other schema parts.
  type Query
  type Mutation

  # An ISO-8601 UTC datetime.
  scalar DateTime

  # An ISO-8601 date (without time).
  scalar Date
`

export default [schema, Auth, List, Task, User]
