import { Maybe } from '../../@types/type-helpers'

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

export interface GetListData {
  list: Maybe<List>
}

export const getListQuery = `
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
