import { Context } from '../types'
import { List } from '../../models/list'
import { Task, TaskModel } from '../../models/task'
import { User, UserModel } from '../../models/user'

export default {
  async tasks(list: List, _args, ctx: Context): Promise<Task[]> {
    return list.tasks || TaskModel.fetchAllByList(ctx.viewer, list.id!)
  },

  async collaborators(list: List, _args, ctx: Context): Promise<User[]> {
    return list.users || UserModel.fetchAllByList(ctx.viewer, list.id!)
  }
}
