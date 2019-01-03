import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    me: PrivateUser @public
    list(id: String!): List
    lists(ids: [String]): [List]
    tasks(ids: [String]): [Task]
  }

  type Mutation {
    # Creates a new list
    createList(input: CreateListInput!): CreateListPayload!
    # Renames an existing list
    renameList(input: RenameListInput!): RenameListPayload!
    # Archives an existing list
    archiveList(input: ArchiveListInput!): ArchiveListPayload!
    # Unarchives an archived list
    unarchiveList(input: UnarchiveListInput!): UnarchiveListPayload!
    # Deletes a list
    deleteList(input: DeleteListInput!): DeleteListPayload!
    # Creates a new task
    createTask(input: CreateTaskInput!): CreateTaskPayload!
    # Update an existing task
    updateTask(input: UpdateTaskInput!): UpdateTaskPayload!
    # Mark a task complete
    completeTask(input: CompleteTaskInput!): CompleteTaskPayload!
    # Mark a task incomplete
    reopenTask(input: ReopenTaskInput!): ReopenTaskPayload!
    # Delets a task
    deleteTask(input: DeleteTaskInput!): DeleteTaskPayload!
  }

  # The input variables for creating a new list
  input CreateListInput {
    # The name of the list
    name: String!
    # TODO: allow task creation at the same time?
  }

  # The response payload from creating a list
  type CreateListPayload {
    # The newly created list
    list: List
    # TODO: error types?
  }

  # The input variables for renaming a list
  input RenameListInput {
    # The id of the list to rename
    id: String!
    # The new name of the list
    name: String!
  }

  # The response payload from renaming a list
  type RenameListPayload {
    # The renamed list
    list: List
    # TODO: error types?
  }

  # The input variables for archiving a list
  input ArchiveListInput {
    # The id of the list you want to archive
    id: String!
  }

  # The response payload for archiving a list
  type ArchiveListPayload {
    list: List
  }

  # The input variables for unarchiving a list
  input UnarchiveListInput {
    # The id of the list you want to unarchive
    id: String!
  }

  # The response payload for unarchiving a list
  type UnarchiveListPayload {
    list: List
  }

  # The input variables to delete a list
  input DeleteListInput {
    # The id of the list you wish to delete
    id: String!
  }

  # The response payload from deleting a list
  type DeleteListPayload {
    # The id of the list that was deleted
    id: String
    # TODO: error types?
  }

  # The input variables for creating a new task
  input CreateTaskInput {
    # The content of the task
    content: String!
    # The id of a list that this task should belong to (optionally)
    # TODO: use UUID type?
    listId: String
  }

  # The response payload for creating a task
  type CreateTaskPayload {
    # The newly created task
    task: Task
    # TODO: error types?
  }

  # The input variables for updating a task
  input UpdateTaskInput {
    # The id of the task to update
    id: String!
    # The (optional) new content for the task
    # When omitted, the content will not change
    content: String
    # The (optional) state of the task
    isCompleted: Boolean
    # The (optional) timestamp of completion
    completedAt: String
  }

  # The response payload from updating a task
  type UpdateTaskPayload {
    task: Task
    # TODO: error types?
  }

  # The input variables to close/complete a task
  input CompleteTaskInput {
    # The id of the task to complete
    id: String!
  }

  # The response payload from completing a task
  type CompleteTaskPayload {
    # The completed task
    task: Task
    # TODO: error types?
  }

  # The input variables to reopen a task
  input ReopenTaskInput {
    # The id of the task to reopen
    id: String!
  }

  # The response payload from reopening (marking incomplete) a task
  type ReopenTaskPayload {
    # The reopened task
    task: Task
    # TODO: error types?
  }

  # The input variables to delete a task
  input DeleteTaskInput {
    # The id of the task you wish to delete
    id: String!
  }

  # The response payload from deleting a task
  type DeleteTaskPayload {
    # The id of the task that was deleted
    id: String
    # TODO: error types?
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
    # TODO: connect to type PublicUser
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
