import { Maybe } from '../../@types/type-helpers'

export interface List {
  id: string
  name: string
}

export interface GetListsData {
  lists: List[]
}

export const getListsQuery = `
  query GetLists {
    lists {
      id
      name
    }
  }
`

export interface CreateListData {
  createList: {
    list: Maybe<List>
  }
}

export const createListMutation = `
  mutation createList($input: CreateListInput!) {
    createList(input: $input) {
      list {
        id
        name
      }
    }
  }
`
