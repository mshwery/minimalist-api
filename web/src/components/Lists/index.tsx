import React from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import ms from 'ms'
import Lists from './Lists'
import { getLists, createList } from './queries'

export const LISTS_QUERY = 'lists'

const ListsView: React.FunctionComponent = () => {
  const queryClient = useQueryClient()

  const { data: lists, isLoading } = useQuery(LISTS_QUERY, getLists, {
    // No need to refetch this so often...
    staleTime: ms('5m'),
  })

  const mutation = useMutation(createList, {
    onSuccess: () => queryClient.invalidateQueries(LISTS_QUERY),
  })

  const history = useHistory()
  const handleCreateList = async (name: string) => {
    try {
      const list = await mutation.mutateAsync({ name })
      history.push(`/lists/${list.id}`)
    } catch (error) {
      // TODO: capture error via Sentry
    }
  }

  if (isLoading || !lists) {
    return null
  }

  return <Lists lists={lists} onCreateList={handleCreateList} isCreatingList={mutation.isLoading} />
}

export default React.memo(ListsView)
