import { Context } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
  async tasks(_root, args: { listId?: string }, ctx: Context): Promise<Task[]> {
    return TaskModel.fetchAllBy(ctx.viewer, args)
  }
}
