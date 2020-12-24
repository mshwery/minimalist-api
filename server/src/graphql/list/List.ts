import { Context, TaskStatus } from '../types'
import { List, ListModel } from '../../models/list'
import { Task, TaskModel } from '../../models/task'
import { User, UserModel } from '../../models/user'

export default {
  async tasks(list: List, args: { status?: TaskStatus }, ctx: Context): Promise<Task[]> {
    const tasks = list.tasks || (await TaskModel.fetchAllByList(ctx.viewer, list.id!))

    if (args.status === TaskStatus.DONE) {
      return tasks.filter((t) => t.isCompleted)
    } else if (args.status === TaskStatus.REMAINING) {
      return tasks.filter((t) => !t.isCompleted)
    } else {
      return tasks
    }
  },

  async creator(list: List, _args: EmptyObject, ctx: Context): Promise<User> {
    return ListModel.fetchCreator(ctx.viewer, list)
  },

  async collaborators(list: List, _args: EmptyObject, ctx: Context): Promise<User[]> {
    return UserModel.fetchAllByList(ctx.viewer, list.id)
  },
}
