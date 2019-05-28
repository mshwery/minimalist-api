import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'

export interface Task {
  id: string
  content: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  completedAt: string
}

export interface List {
  id: string
  name: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  archivedAt: string
  tasks: Task[]
}

interface GetListData {
  list: Maybe<List>
}

const getListQuery = `
  query GetList($id: ID!) {
    list(id: $id) {
      id
      name
      isArchived
      createdAt
      updatedAt
      archivedAt

      tasks {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
      }
    }
  }
`

export function getList(id: string) {
  return client.request<GetListData>(getListQuery, { id })
}

interface RenameListData {
  renameList: {
    list: Maybe<List>
  }
}

export const renameListMutation = `
  mutation RenameList($input: RenameListInput!) {
    renameList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function renameList(id: string, name: string) {
  const result = await client.request<RenameListData>(renameListMutation, {
    input: {
      id,
      name
    }
  })

  return result.renameList
}

interface CreateTaskData {
  createTask: {
    task: Maybe<Task>
  }
}

export const createTaskMutation = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
      }
    }
  }
`

export async function createTask(content: string, listId?: string) {
  const result = await client.request<CreateTaskData>(createTaskMutation, {
    input: {
      content,
      listId
    }
  })

  return result.createTask
}

interface CompleteTaskData {
  completeTask: {
    task: Maybe<Task>
  }
}

export const completeTaskMutation = `
  mutation CompleteTask($input: CompleteTaskInput!) {
    completeTask(input: $input) {
      task {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
      }
    }
  }
`

export async function completeTask(taskId: string) {
  const result = await client.request<CompleteTaskData>(completeTaskMutation, {
    input: {
      id: taskId
    }
  })

  return result.completeTask
}

interface ReopenTaskData {
  reopenTask: {
    task: Maybe<Task>
  }
}

export const reopenTaskMutation = `
  mutation ReopenTask($input: ReopenTaskInput!) {
    reopenTask(input: $input) {
      task {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
      }
    }
  }
`

export async function reopenTask(taskId: string) {
  const result = await client.request<ReopenTaskData>(reopenTaskMutation, {
    input: {
      id: taskId
    }
  })

  return result.reopenTask
}
