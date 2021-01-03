import ms from 'ms'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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

async function getLists(): Promise<List[]> {
  const { lists } = await client.request<GetListsData>(getListsQuery)
  return lists
}

export function useLists() {
  const { error, isLoading, data } = useQuery('lists', getLists, {
    // No need to refetch this so often...
    staleTime: ms('5m'),
  })

  return {
    error,
    isLoading,
    lists: data,
  }
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

async function createList(input: { name: string }): Promise<List> {
  const result = await client.request<CreateListData>(createListMutation, { input })
  return result.createList.list
}

export function useCreateList() {
  const queryClient = useQueryClient()

  return useMutation(createList, {
    onSuccess: () => {
      queryClient.invalidateQueries('lists')
    },
  })
}
