import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'

export interface List {
  id: string
  name: string
}

interface GetListsData {
  lists: List[]
}

const getListsQuery = `
  query GetLists {
    lists(status: ACTIVE) {
      id
      name
      archivedAt
    }
  }
`

export function getLists() {
  return client.request<GetListsData>(getListsQuery)
}

interface CreateListData {
  createList: {
    list: Maybe<List>
  }
}

const createListMutation = `
  mutation CreateList($input: CreateListInput!) {
    createList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function createList(name: string) {
  const result = await client.request<CreateListData>(createListMutation, {
    input: {
      name
    }
  })

  return result.createList
}
