import React, { useCallback, useState } from 'react'
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useGetTasks } from '../data/tasks'
import Task from './Task'
import CreateTaskModal from './CreateTaskModal'

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
  }
})

interface Props {
  listId: string
  listName?: string
}

const List: React.FC<Props> = ({
  listId,
}) => {
  const [isCreateModalVisible, setModalVisible] = useState(false)
  const { loading, data, error, refetch, networkStatus } = useGetTasks(listId)
  const mightHaveTasks = loading && data && data.tasks.length === 0
  const hasTasks = data && data.tasks.length > 0

  const onRequestOpen = useCallback(() => setModalVisible(true), [setModalVisible])
  const onRequestClose = useCallback(() => setModalVisible(false), [setModalVisible])

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
          <Button title='Open Bottom Sheet' onPress={onRequestOpen} />
        </View>
      </ScrollView>
      <CreateTaskModal listId={listId} isVisible={isCreateModalVisible} onRequestClose={onRequestClose} />
    </SafeAreaView>
  )
}

export default List
