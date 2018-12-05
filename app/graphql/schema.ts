import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    me: PrivateUser
    list(id: String!): List
    lists(ids: [String]): [List]
    task(id: String!): Task
    tasks(ids: [String]): [Task]
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

    # The associated tasks
    tasks: [Task!]
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

    # TODO: evaluate exposing 'list' field to find associated parent list
    # (which could result in circular references: task.list.tasks[0].list.tasks etc)
  }

  type PrivateUser {
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
