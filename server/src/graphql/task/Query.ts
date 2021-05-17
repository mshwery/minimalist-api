import { Context, TaskStatus } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
  async tasks(
    _root: EmptyObject,
    args: { listId?: string; status?: TaskStatus; dueBy?: string },
    ctx: Context
  ): Promise<Task[]> {
    return TaskModel.fetchAllBy(ctx.viewer, args)
  },
}
