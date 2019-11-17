import React from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import Lists from './Lists'
import { getLists, createList } from './queries'

const LISTS_QUERY = 'lists'

const ListsView: React.FunctionComponent = (props) => {
  const { data: lists, isLoading } = useQuery(LISTS_QUERY, getLists, {
    staleTime: 120000
  })
  const [mutate, { isLoading: isCreatingList }] = useMutation(createList, {
    refetchQueries: [LISTS_QUERY]
  })

  const history = useHistory()
  const handleCreateList = async (name: string) => {
    try {
      const list = await mutate({ name })
      history.push(`/lists/${list.id}`)
    } catch (error) {
      // TODO: capture error via Sentry
    }
  }

  if (isLoading || !lists) {
    return null
  }

  return (
    <Lists
      lists={lists}
      onCreateList={handleCreateList}
      isCreatingList={isCreatingList}
    />
  )
}

export default React.memo(ListsView)
