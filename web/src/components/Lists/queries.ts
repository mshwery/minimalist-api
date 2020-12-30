import client, { gql } from '../../lib/graphql-client'

export interface List {
  id: string
  name: string
}

interface GetListsData {
  lists: List[]
}

const getListsQuery = gql`
  query GetLists {
    lists(status: ACTIVE) {
      id
      name
      archivedAt
    }
  }
`

export async function getLists(): Promise<List[]> {
  const { lists } = await client.request<GetListsData>(getListsQuery)
  return lists
}

interface CreateListData {
  createList: {
    list: List
  }
}

const createListMutation = gql`
  mutation CreateList($input: CreateListInput!) {
    createList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

export async function createList(input: { name: string }): Promise<List> {
  const result = await client.request<CreateListData>(createListMutation, { input })
  return result.createList.list
}
