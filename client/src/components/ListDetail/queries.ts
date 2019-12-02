import { setQueryData } from 'react-query'
import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'
import { LISTS_QUERY } from '../Lists'

export interface Task {
  id: string
  content: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  sortOrder: number | null
  listId?: string | null
}

export interface User {
  id: string
  email: string
  name?: string
  image?: string
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
    list(id: $id)  {
      id
      name
      isArchived
      createdAt
      updatedAt
      archivedAt
    }
  }
`

export function getList(id: string) {
  return client.request<GetListData>(getListQuery, { id })
}

interface GetTasksData {
  tasks: Task[]
}

const getTasksQuery = `
  query GetTasks($listId: ID!) {
    tasks(listId: $listId) {
      id
      content
      isCompleted
      createdAt
      updatedAt
      completedAt
      sortOrder
      listId
    }
  }
`

export function getTasks(listId: string) {
  return client.request<GetTasksData>(getTasksQuery, { listId })
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
  // Optimistic update
  setQueryData(
    LISTS_QUERY,
    (lists: List[]) =>
      lists.map(list => {
        if (list.id === id) {
          return { ...list, name }
        }

        return list
      }),
    { shouldRefetch: false }
  )

  const result = await client.request<RenameListData>(renameListMutation, {
    input: {
      id,
      name
    }
  })

  return result.renameList
}

interface ArchiveListData {
  archiveList: {
    list: Maybe<List>
  }
}

export const archiveListMutation = `
  mutation ArchiveList($input: ArchiveListInput!) {
    archiveList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function archiveList(id: string) {
  // Optimistic update
  setQueryData(LISTS_QUERY, (lists: List[]) => lists.filter(l => l.id !== id), { shouldRefetch: false })

  const result = await client.request<ArchiveListData>(archiveListMutation, {
    input: {
      id
    }
  })

  return result.archiveList
}

interface DeleteListData {
  deleteList: {
    id: Maybe<string>
  }
}

export const deleteListMutation = `
  mutation DeleteList($input: DeleteListInput!) {
    deleteList(input: $input) {
      id
    }
  }
`

export async function deleteList(id: string) {
  // Optimistic update
  setQueryData(LISTS_QUERY, (lists: List[]) => lists.filter(l => l.id !== id), { shouldRefetch: false })

  const result = await client.request<DeleteListData>(deleteListMutation, {
    input: {
      id
    }
  })

  return result.deleteList.id
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
        sortOrder
        listId
      }
    }
  }
`

interface CreateTaskArgs {
  id?: string
  content: string
  position?: number
  listId?: string
}

export async function createTask({ id, content, position, listId }: CreateTaskArgs) {
  const result = await client.request<CreateTaskData>(createTaskMutation, {
    input: {
      id,
      content,
      insertAt: position,
      listId
    }
  })

  return result.createTask
}

interface UpdateTaskData {
  updateTask: {
    task: Maybe<Task>
  }
}

export const updateTaskMutation = `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
        sortOrder
        listId
      }
    }
  }
`

export async function updateTask(input: { id: string; content: string }) {
  const result = await client.request<UpdateTaskData>(updateTaskMutation, { input })
  return result.updateTask.task
}

interface MoveTaskData {
  moveTask: {
    task: Maybe<Task>
  }
}

export const moveTaskMutation = `
  mutation MoveTask($input: MoveTaskInput!) {
    moveTask(input: $input) {
      task {
        id
        content
        isCompleted
        createdAt
        updatedAt
        completedAt
        sortOrder
        listId
      }
    }
  }
`

export async function moveTask(args: { id: string; listId: string; insertBefore: number }) {
  const result = await client.request<MoveTaskData>(moveTaskMutation, {
    input: args
  })

  return result.moveTask
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
        sortOrder
        listId
      }
    }
  }
`

export async function completeTask(input: { id: string }) {
  const result = await client.request<CompleteTaskData>(completeTaskMutation, { input })
  return result.completeTask.task
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
        sortOrder
        listId
      }
    }
  }
`

export async function reopenTask(input: { id: string }) {
  const result = await client.request<ReopenTaskData>(reopenTaskMutation, { input })
  return result.reopenTask.task
}

interface DeleteTaskData {
  deleteTask: {
    id?: string
  }
}

export const deleteTaskMutation = `
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`

export async function deleteTask(input: { id: string }) {
  const result = await client.request<DeleteTaskData>(deleteTaskMutation, { input })
  return result.deleteTask.id
}

interface GetCollaboratorsData {
  list: Maybe<
    List & {
      creator?: User
      collaborators?: User[]
    }
  >
}

const getCollaboratorsQuery = `
  query GetCollaborators($id: ID!) {
    list(id: $id) {
      id
      creator {
        id
        email
        name
        image
      }
      collaborators {
        id
        email
        name
        image
      }
    }
  }
`

export async function getCollaborators(input: { id: string }) {
  const result = await client.request<GetCollaboratorsData>(getCollaboratorsQuery, input)
  const list = result.list!
  const collaborators = list.collaborators!.map(user => ({ ...user, isOwner: false }))
  const creator = Object.assign(list.creator, { isOwner: true })
  return [creator, ...collaborators]
}

interface ShareListData {
  shareList: {
    list: Maybe<
      List & {
        collaborators?: User[]
      }
    >
  }
}

export const shareListMutation = `
  mutation ShareList($input: ShareListInput!) {
    shareList(input: $input) {
      list {
        id
        collaborators {
          id
          name
          email
          image
        }
      }
    }
  }
`

export async function shareList(input: { id: string; email: string }) {
  const result = await client.request<ShareListData>(shareListMutation, { input })
  return result.shareList.list!.collaborators
}

interface UnshareListData {
  unshareList: {
    list: Maybe<
      List & {
        collaborators?: User[]
      }
    >
  }
}

export const unshareListMutation = `
  mutation UnshareList($input: UnshareListInput!) {
    unshareList(input: $input) {
      list {
        id
        collaborators {
          id
          name
          email
          image
        }
      }
    }
  }
`

export async function unshareList(input: { id: string; email: string }) {
  const result = await client.request<UnshareListData>(unshareListMutation, { input })
  return result.unshareList.list!.collaborators
}
