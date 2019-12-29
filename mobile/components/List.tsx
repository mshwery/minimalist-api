import React from 'react'
import { StyleSheet, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Task from './Task'
import { TaskType } from '../data/tasks'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  ScrollView: {
    flex: 1,
    paddingVertical: 8,
  },
})

const GetTasks = gql`
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


interface GetTasksData {
  tasks: TaskType[]
}

interface Props {
  listId: string
  listName: string
}

const List: React.FC<Props> = ({
  listId,
  listName
}) => {
  const { loading, data, error, refetch } = useQuery<GetTasksData>(GetTasks, {
    variables: {
      listId
    },
    fetchPolicy: 'cache-and-network'
  })

  const mightHaveTasks = loading && data && data.tasks.length === 0
  const hasTasks = data && data.tasks.length > 0

  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        refreshControl={<RefreshControl colors={['#2e8ae6']} tintColor='#2e8ae6' refreshing={loading} onRefresh={() => refetch()} />}
      >
        {error ? (
          <Text>There was an an error.</Text>
        ) : !hasTasks && !mightHaveTasks ? (
          <Text>No tasks yet!</Text>
        ) : hasTasks && data.tasks.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default List
