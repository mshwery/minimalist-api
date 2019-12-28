import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import IconButton from './IconButton'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  ScrollView: {
    flex: 1,
    paddingVertical: 16
  },
  Task: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  TaskContent: {
    fontSize: 18,
    marginLeft: 12,
    marginTop: 7,
    flex: 1,
  }
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

interface Task {
  id: string
  content: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  sortOrder: number | null
  listId?: string | null
}

interface GetTasksData {
  tasks: Task[]
}

const CompleteTask = gql`
  mutation CompleteTask($input: CompleteTaskInput!) {
    completeTask(input: $input) {
      task {
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
  }
`

interface CompleteTaskData {
  completeTask: {
    task: Task | null
  }
}

const Task: React.FC<Task> = ({ id, content, isCompleted }) => {
  const [markCompleted] = useMutation<CompleteTaskData>(CompleteTask, {
    variables: {
      input: {
        id
      }
    }
  })

  return (
    <View style={styles.Task}>
      <IconButton
        name={isCompleted ? 'check' : 'square'}
        color={isCompleted ? '#2e8ae6' : '#787A87'}
        size={22}
        onPress={isCompleted ? undefined : () => markCompleted()}
      />
      <Text style={styles.TaskContent}>{content}</Text>
    </View>
  )
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

  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        refreshControl={<RefreshControl colors={['#2e8ae6']} tintColor='#2e8ae6' refreshing={loading} onRefresh={() => refetch()} />}
      >
        {loading ? (
          null
        ) : error ? (
          <Text>There was an an error.</Text>
        ) : !data || !Array.isArray(data.tasks) || data.tasks.length === 0 ? (
          <Text>No tasks yet!</Text>
        ) : data.tasks.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default List
