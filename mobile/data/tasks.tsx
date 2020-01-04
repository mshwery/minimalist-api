import { useMutation, useQuery } from '@apollo/react-hooks'
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

export function useGetTasks(listId: string) {
  return useQuery<GetTasksData>(GetTasks, {
    variables: {
      listId
    },
    fetchPolicy: 'cache-and-network'
  })
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

const CreateTask = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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

interface CreateTaskData {
  __typename: 'Mutation',
  createTask: {
    __typename: 'CreateTaskResponse'
    task: null | (TaskType & {
      __typename: 'Task'
    })
  }
}

export function useCreateTask(listId: string) {
  return useMutation<CreateTaskData, { input: { listId?: string, content: string }}>(CreateTask, {
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      createTask: {
        __typename: 'CreateTaskResponse',
        task: {
          __typename: 'Task',
          ...input,
          id: '-1', // TODO fix this
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: null,
          sortOrder: null
        }
      }
    }),
    refetchQueries: [{
      query: GetTasks,
      variables: { listId }
    }],
    update: (proxy, { data: { createTask } }) => {
      // Get the cached data
      const data = proxy.readQuery<GetTasksData>({ query: GetTasks, variables: { listId } })
      // Write data back to the cache
      proxy.writeQuery({ query: GetTasks, data: {
        tasks: [...data.tasks, createTask.task]
      }})
    }
  })
}
