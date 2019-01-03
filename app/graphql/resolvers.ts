import { User, UserModel } from '../models/user'
import { Viewer } from '../types'
import { List, ListModel } from '../models/list'
import { Task, TaskModel } from '../models/task'

interface IContext {
  viewer: Viewer
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
    }
  },

  List: {
    async tasks(list: List, _args, ctx: IContext): Promise<Task[]> {
      return list.tasks || TaskModel.fetchAllByList(ctx.viewer, list.id!)
    }
  }
}

export default resolvers
