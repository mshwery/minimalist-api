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
  query GetTasks($listId: ID!, $status: TaskStatus!) {
    tasks(listId: $listId, status: $status) {
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
      listId,
      status: 'REMAINING',
    },
    fetchPolicy: 'cache-and-network',
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
  __typename: 'Mutation'
  completeTask: {
    __typename: 'CompleteTaskResponse'
    task:
      | null
      | (TaskType & {
          __typename: 'Task'
        })
  }
}

export function useMarkComplete(task: TaskType) {
  return useMutation<CompleteTaskData>(CompleteTask, {
    variables: {
      input: {
        id: task.id,
      },
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
          completedAt: new Date().toISOString(),
        },
      },
    },
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
  __typename: 'Mutation'
  reopenTask: {
    __typename: 'ReopenTaskResponse'
    task:
      | null
      | (TaskType & {
          __typename: 'Task'
        })
  }
}

export function useMarkIncomplete(task: TaskType) {
  return useMutation<ReopenTaskData>(ReopenTask, {
    variables: {
      input: {
        id: task.id,
      },
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
          completedAt: null,
        },
      },
    },
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
  __typename: 'Mutation'
  createTask: {
    __typename: 'CreateTaskResponse'
    task:
      | null
      | (TaskType & {
          __typename: 'Task'
        })
  }
}

export function useCreateTask(listId: string) {
  return useMutation<CreateTaskData, { input: { listId?: string; content: string } }>(CreateTask, {
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
          sortOrder: null,
        },
      },
    }),
    refetchQueries: [
      {
        query: GetTasks,
        variables: { listId, status: 'REMAINING' },
      },
    ],
    update: (proxy, { data: { createTask } }) => {
      // Get the cached data
      const data = proxy.readQuery<GetTasksData>({ query: GetTasks, variables: { listId, status: 'REMAINING' } })
      // Write data back to the cache
      proxy.writeQuery({
        query: GetTasks,
        variables: { listId, status: 'REMAINING' },
        data: {
          tasks: [...data.tasks, createTask.task],
        },
      })
    },
  })
}

const UpdateTask = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
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

interface UpdateTaskData {
  __typename: 'Mutation'
  updateTask: {
    __typename: 'UpdateTaskResponse'
    task:
      | null
      | (TaskType & {
          __typename: 'Task'
        })
  }
}

export function useUpdateTask(task: TaskType, listId: string) {
  return useMutation<UpdateTaskData, { input: { id: string; content: string } }>(UpdateTask, {
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      updateTask: {
        __typename: 'UpdateTaskResponse',
        task: {
          __typename: 'Task',
          ...task,
          ...input,
          updatedAt: new Date().toISOString(),
        },
      },
    }),
    refetchQueries: [
      {
        query: GetTasks,
        variables: { listId, status: 'REMAINING' },
      },
    ],
  })
}

const DeleteTask = gql`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`

interface DeleteTaskData {
  __typename: 'Mutation'
  deleteTask: {
    __typename: 'DeleteTaskResponse'
    id: null | string
  }
}

export function useDeleteTask(listId: string) {
  return useMutation<DeleteTaskData, { input: { id: string } }>(DeleteTask, {
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      deleteTask: {
        __typename: 'DeleteTaskResponse',
        id: input.id,
      },
    }),
    refetchQueries: [
      {
        query: GetTasks,
        variables: { listId, status: 'REMAINING' },
      },
    ],
    update: (proxy, { data: { deleteTask } }) => {
      // Get the cached data
      const data = proxy.readQuery<GetTasksData>({ query: GetTasks, variables: { listId, status: 'REMAINING' } })
      // Write data back to the cache
      proxy.writeQuery({
        query: GetTasks,
        variables: { listId, status: 'REMAINING' },
        data: {
          tasks: data.tasks.filter((t) => t.id !== deleteTask.id),
        },
      })
    },
  })
}
