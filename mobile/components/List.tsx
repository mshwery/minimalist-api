import React, { useRef, useCallback } from 'react'
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, TextInput, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { TaskType } from '../data/tasks'
import BottomSheet, { BottomSheetRef } from './BottomSheet'
import Task from './Task'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  ScrollView: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 80,
  },
  EmptyStateContainer: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  EmptyStateText: {
    color: '#787A87',
  },
  AddTaskButton: {
    margin: 16
  },
  EditModalContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  TaskInput: {
    fontSize: 18,
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

interface GetTasksData {
  tasks: TaskType[]
}

interface Props {
  listId: string
  listName?: string
}

const List: React.FC<Props> = ({
  listId,
}) => {
  const bottomSheet = useRef<BottomSheetRef>()
  const newTaskRef = useRef<TextInput>()
  const { loading, data, error, refetch, networkStatus } = useQuery<GetTasksData>(GetTasks, {
    variables: {
      listId
    },
    fetchPolicy: 'cache-and-network'
  })

  const mightHaveTasks = loading && data && data.tasks.length === 0
  const hasTasks = data && data.tasks.length > 0

  const createNewTask = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    console.log(e.nativeEvent.text)
  }, [])

  // Hack because `autoFocus` in a `Modal` doesn't always work...
  const onCreateTaskOpen = useCallback(() => {
    if (newTaskRef.current) {
      newTaskRef.current.focus()
    }
  }, [])

  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        refreshControl={<RefreshControl colors={['#2e8ae6']} tintColor='#2e8ae6' refreshing={networkStatus === 4} onRefresh={() => refetch()} />}
      >
        {error ? (
          <Text>There was an an error.</Text>
        ) : !hasTasks && !mightHaveTasks ? (
          <View style={styles.EmptyStateContainer}>
            <Text style={styles.EmptyStateText}>No tasks yet</Text>
          </View>
        ) : hasTasks && data.tasks.map(task => (
          <Task key={task.id} {...task} />
        ))}
        <View style={styles.AddTaskButton}>
          <Button title='Open Bottom Sheet' onPress={() => {
            if (bottomSheet.current) {
              bottomSheet.current.open()
            }
          }} />
        </View>
      </ScrollView>
      <BottomSheet
        animationType='fade'
        closeOnSwipeDown
        customStyles={{
          container: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }
        }}
        duration={150}
        onOpen={onCreateTaskOpen}
        ref={bottomSheet}
      >
        <View style={styles.EditModalContainer}>
          <TextInput
            autoCapitalize='sentences'
            autoCorrect
            blurOnSubmit
            enablesReturnKeyAutomatically
            multiline
            onSubmitEditing={createNewTask}
            placeholder='Add a task'
            placeholderTextColor='#A6B1BB'
            ref={newTaskRef}
            returnKeyType='done'
            style={styles.TaskInput}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}

export default List
