import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import IconButton from '../IconButton'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderBottomColor: '#e4e4e6',
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  task: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    fontSize: 18,
    marginLeft: 12,
    marginVertical: 9,
    lineHeight: 24,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#787A87'
  }
})

interface Props {
  content: string
  isComplete: boolean
  onPressCheckbox: () => void
  onPressContainer: () => void
}

export const Task: React.FC<Props> = ({
  content,
  isComplete,
  onPressCheckbox,
  onPressContainer
}) => {
  return (
    <Touchable
      style={styles.container}
      onPress={onPressContainer}
      delayPressOut={300}
    >
      <View style={styles.task}>
        <IconButton
          size={24}
          name={isComplete ? 'check' : 'circle'}
          color={isComplete ? '#2e8ae6' : '#a7aaba'}
          onPress={onPressCheckbox}
          withHapticFeedback
        />
        <Text style={[styles.content, isComplete && styles.completed]}>{content}</Text>
      </View>
    </Touchable>
  )
}
