import { setQueryData } from 'react-query'
import { Maybe } from '../../@types/type-helpers'
import client, { gql } from '../../lib/graphql-client'
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
  createdBy: string
  updatedAt: string
  archivedAt: string
  tasks: Task[]
}

interface GetListData {
  list: Maybe<List>
}

const getListQuery = gql`
  query GetList($id: ID!) {
    list(id: $id) {
      id
      name
      isArchived
      createdAt
      createdBy
      updatedAt
      archivedAt
    }
  }
`

export function getList(id: string): Promise<GetListData> {
  return client.request<GetListData>(getListQuery, { id })
}

interface GetTasksData {
  tasks: Task[]
}

const getTasksQuery = gql`
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

export function getTasks(listId: string): Promise<GetTasksData> {
  return client.request<GetTasksData>(getTasksQuery, { listId })
}

interface RenameListData {
  renameList: {
    list: Maybe<List>
  }
}

export const renameListMutation = gql`
  mutation RenameList($input: RenameListInput!) {
    renameList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function renameList(id: string, name: string): Promise<{ list: Maybe<List> }> {
  // Optimistic update
  setQueryData(
    LISTS_QUERY,
    (lists: List[]) =>
      lists.map((list) => {
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
      name,
    },
  })

  return result.renameList
}

interface ArchiveListData {
  archiveList: {
    list: Maybe<List>
  }
}

export const archiveListMutation = gql`
  mutation ArchiveList($input: ArchiveListInput!) {
    archiveList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function archiveList(id: string): Promise<{ list: Maybe<List> }> {
  // Optimistic update
  setQueryData(LISTS_QUERY, (lists: List[]) => lists.filter((l) => l.id !== id), { shouldRefetch: false })

  const result = await client.request<ArchiveListData>(archiveListMutation, {
    input: {
      id,
    },
  })

  return result.archiveList
}

interface DeleteListData {
  deleteList: {
    id: Maybe<string>
  }
}

export const deleteListMutation = gql`
  mutation DeleteList($input: DeleteListInput!) {
    deleteList(input: $input) {
      id
    }
  }
`

export async function deleteList(id: string): Promise<Maybe<string>> {
  // Optimistic update
  setQueryData(LISTS_QUERY, (lists: List[]) => lists.filter((l) => l.id !== id), { shouldRefetch: false })

  const result = await client.request<DeleteListData>(deleteListMutation, {
    input: {
      id,
    },
  })

  return result.deleteList.id
}

interface CreateTaskData {
  createTask: {
    task: Maybe<Task>
  }
}

export const createTaskMutation = gql`
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

export async function createTask({ id, content, position, listId }: CreateTaskArgs): Promise<{ task: Maybe<Task> }> {
  const result = await client.request<CreateTaskData>(createTaskMutation, {
    input: {
      id,
      content,
      insertAt: position,
      listId,
    },
  })

  return result.createTask
}

interface UpdateTaskData {
  updateTask: {
    task: Maybe<Task>
  }
}

export const updateTaskMutation = gql`
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

export async function updateTask(input: { id: string; content: string }): Promise<Maybe<Task>> {
  const result = await client.request<UpdateTaskData>(updateTaskMutation, { input })
  return result.updateTask.task
}

interface MoveTaskData {
  moveTask: {
    task: Maybe<Task>
  }
}

export const moveTaskMutation = gql`
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

export async function moveTask(args: {
  id: string
  listId: string
  insertBefore: number
}): Promise<{ task: Maybe<Task> }> {
  const result = await client.request<MoveTaskData>(moveTaskMutation, {
    input: args,
  })

  return result.moveTask
}

interface CompleteTaskData {
  completeTask: {
    task: Maybe<Task>
  }
}

export const completeTaskMutation = gql`
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

export async function completeTask(input: { id: string }): Promise<Maybe<Task>> {
  const result = await client.request<CompleteTaskData>(completeTaskMutation, { input })
  return result.completeTask.task
}

interface ReopenTaskData {
  reopenTask: {
    task: Maybe<Task>
  }
}

export const reopenTaskMutation = gql`
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

export async function reopenTask(input: { id: string }): Promise<Maybe<Task>> {
  const result = await client.request<ReopenTaskData>(reopenTaskMutation, { input })
  return result.reopenTask.task
}

interface DeleteTaskData {
  deleteTask: {
    id?: string
  }
}

export const deleteTaskMutation = gql`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`

export async function deleteTask(input: { id: string }): Promise<string | undefined> {
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

const getCollaboratorsQuery = gql`
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

interface Collaborator extends User {
  isOwner: boolean
}

export async function getCollaborators(input: { id: string }): Promise<Array<Collaborator>> {
  const { list } = await client.request<GetCollaboratorsData>(getCollaboratorsQuery, input)
  if (!list) {
    return []
  }

  const collaborators: Collaborator[] = []

  if (list.creator) {
    const creator = Object.assign(list.creator, { isOwner: true })
    collaborators.push(creator)
  }

  if (list && Array.isArray(list?.collaborators)) {
    collaborators.push(...list.collaborators.map((user) => ({ ...user, isOwner: false })))
  }

  return collaborators
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

export const shareListMutation = gql`
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

export async function shareList(input: { id: string; email: string }): Promise<User[]> {
  const result = await client.request<ShareListData>(shareListMutation, { input })
  return result.shareList.list?.collaborators ?? []
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

export const unshareListMutation = gql`
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

export async function unshareList(input: { id: string; email: string }): Promise<User[] | undefined> {
  const result = await client.request<UnshareListData>(unshareListMutation, { input })
  return result.unshareList.list?.collaborators ?? []
}
