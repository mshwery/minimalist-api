import { User, UserModel } from '../models/user'
import { Viewer } from '../types'
import { List, ListModel } from '../models/list'
import { Task, TaskModel } from '../models/task'

interface IContext {
  viewer: Viewer
}

interface IMutationInput<T> {
  input: T
}

const resolvers = {
  Query: {
    async me(_root, _args, ctx: IContext): Promise<User | null> {
      return UserModel.fetchByViewer(ctx.viewer)
    },

    async list(_root, args: { id: string }, ctx: IContext): Promise<List | null> {
      return ListModel.fetch(ctx.viewer, args.id)
    },

    async lists(_root, args: { ids: string[] }, ctx: IContext): Promise<List[]> {
      return ListModel.fetchAllByViewer(ctx.viewer, args.ids)
    },

    async tasks(_root, args: { ids: string[] }, ctx: IContext): Promise<Task[]> {
      return TaskModel.fetchAllByViewer(ctx.viewer, args.ids)
    }
  },

  Mutation: {
    async createList(_root, args: IMutationInput<{ name: string }>, ctx: IContext): Promise<{ list: List }> {
      const list = await ListModel.create(ctx.viewer, { name: args.input.name })
      return { list }
    },

    async renameList(
      _root,
      args: IMutationInput<{ id: string; name: string }>,
      ctx: IContext
    ): Promise<{ list: List }> {
      const list = await ListModel.update(ctx.viewer, args.input.id, { name: args.input.name })
      return { list }
    },

    async archiveList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ list: List }> {
      const list = await ListModel.archive(ctx.viewer, args.input.id)
      return { list }
    },

    async unarchiveList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ list: List }> {
      const list = await ListModel.unarchive(ctx.viewer, args.input.id)
      return { list }
    },

    async deleteList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ id: string }> {
      const id = args.input.id
      await ListModel.delete(ctx.viewer, id)
      return { id }
    },

    async createTask(
      _root,
      args: IMutationInput<{ content: string; listId?: string }>,
      ctx: IContext
    ): Promise<{ task: Task }> {
      const task = await TaskModel.create(ctx.viewer, {
        content: args.input.content,
        listId: args.input.listId
      })

      return { task }
    },

    async updateTask(
      _root,
      args: IMutationInput<{ id: string; content?: string; isCompleted?: boolean; completedAt?: string }>,
      ctx: IContext
    ): Promise<{ task: Task }> {
      const task = await TaskModel.update(ctx.viewer, args.input.id, args.input)
      return { task }
    },

    async completeTask(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ task: Task }> {
      const task = await TaskModel.markComplete(ctx.viewer, args.input.id)
      return { task }
    },

    async reopenTask(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ task: Task }> {
      const task = await TaskModel.markIncomplete(ctx.viewer, args.input.id)
      return { task }
    },

    async deleteTask(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ id: string }> {
      const id = args.input.id
      await TaskModel.delete(ctx.viewer, id)
      return { id }
    }
  },

  List: {
    async tasks(list: List, _args, ctx: IContext): Promise<Task[]> {
      return list.tasks || TaskModel.fetchAllByList(ctx.viewer, list.id!)
    }
  }
}

export default resolvers
