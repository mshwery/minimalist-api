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

  # These will get extended later
  type Query
  type Mutation
`

export default [schema, Auth, List, Task, User]
