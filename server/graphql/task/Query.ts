import { Context, TaskStatus } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
  async tasks(_root, args: { listId?: string; status?: TaskStatus }, ctx: Context): Promise<Task[]> {
    return TaskModel.fetchAllBy(ctx.viewer, args)
  },
}
