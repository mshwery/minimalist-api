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

interface RenameListVariables {
  input: {
    id: string
    name: string
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
