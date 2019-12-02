import { Context } from '../types'
import { List, ListModel } from '../../models/list'
import { Task, TaskModel } from '../../models/task'
import { User, UserModel } from '../../models/user'

export default {
  async tasks(list: List, _args, ctx: Context): Promise<Task[]> {
    return list.tasks || TaskModel.fetchAllByList(ctx.viewer, list.id!)
  },

  async creator(list: List, _args, ctx: Context): Promise<User> {
    return ListModel.fetchCreator(ctx.viewer, list)
  },

  async collaborators(list: List, _args, ctx: Context): Promise<User[]> {
    return UserModel.fetchAllByList(ctx.viewer, list.id!)
  }
}
