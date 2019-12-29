import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export interface TaskType {
  id: string
  content: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  sortOrder: number | null
  listId?: string | null
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
  __typename: 'Mutation',
  completeTask: {
    __typename: 'CompleteTaskResponse'
    task: null | (TaskType & {
      __typename: 'Task'
    })
  }
}

export function useMarkComplete(task: TaskType) {
  return useMutation<CompleteTaskData>(CompleteTask, {
    variables: {
      input: {
        id: task.id
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      completeTask: {
        __typename: 'CompleteTaskResponse',
        task: {
          __typename: 'Task',
          ...task,
          id: task.id,
          isCompleted: true,
          updatedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      }
    }
  })
}

const ReopenTask = gql`
  mutation ReopenTask($input: ReopenTaskInput!) {
    reopenTask(input: $input) {
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

interface ReopenTaskData {
  __typename: 'Mutation',
  reopenTask: {
    __typename: 'ReopenTaskResponse'
    task: null | (TaskType & {
      __typename: 'Task'
    })
  }
}

export function useMarkIncomplete(task: TaskType) {
  return useMutation<ReopenTaskData>(ReopenTask, {
    variables: {
      input: {
        id: task.id
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      reopenTask: {
        __typename: 'ReopenTaskResponse',
        task: {
          __typename: 'Task',
          ...task,
          id: task.id,
          isCompleted: false,
          updatedAt: new Date().toISOString(),
          completedAt: null
        }
      }
    }
  })
}
