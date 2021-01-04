import React from 'react'
import { useHistory } from 'react-router-dom'
import Lists from './Lists'
import { useLists, useCreateList } from './queries'

export const LISTS_QUERY = 'lists'

const ListsView: React.FunctionComponent = () => {
  const { lists, isLoading } = useLists()
  const createList = useCreateList()

  const history = useHistory()
  const handleCreateList = async (name: string) => {
    try {
      const list = await createList.mutateAsync({ name })
      history.push(`/lists/${list.id}`)
    } catch (error) {
      // TODO: capture error via Sentry
    }
  }

  if (isLoading || !lists) {
    return null
  }

  return <Lists lists={lists} onCreateList={handleCreateList} isCreatingList={createList.isLoading} />
}

export default React.memo(ListsView)
