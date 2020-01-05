import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useGetTasks } from '../data/tasks'
import Task from './Task'
import EditTaskModal from './EditTaskModal'
import FloatingActionButton from './FloatingActionButton'

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
  const [selectedTask, setSelectedTask] = useState(null)
  const [isEditModeVisible, setEditModeVisible] = useState(false)
  const { loading, data, error, refetch, networkStatus } = useGetTasks(listId)
  const mightHaveTasks = loading && data && data.tasks.length === 0
  const hasTasks = data && data.tasks.length > 0

  const onRequestCreate = useCallback(() => {
    setSelectedTask(null)
    setEditModeVisible(true)
  }, [setEditModeVisible])

  const onRequestClose = useCallback(() => {
    setEditModeVisible(false)
    setSelectedTask(null)
  }, [setEditModeVisible])

  const onRequestEdit = useCallback((id: string) => {
    setSelectedTask(id)
    setEditModeVisible(true)
  }, [setEditModeVisible])

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
          <Task key={task.id} {...task} onRequestEdit={onRequestEdit} />
        ))}
      </ScrollView>
      <FloatingActionButton
        initiallyVisible
        isVisible={!isEditModeVisible}
        onPress={onRequestCreate}
      />
      <EditTaskModal
        listId={listId}
        task={selectedTask && hasTasks ? data.tasks.find(t => t.id === selectedTask) : undefined}
        isVisible={isEditModeVisible}
        onRequestClose={onRequestClose}
      />
    </SafeAreaView>
  )
}

export default List
