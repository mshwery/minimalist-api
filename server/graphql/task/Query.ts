import { Context } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
  async tasks(_root, args: { ids?: string[], listId?: string }, ctx: Context): Promise<Task[]> {
    return TaskModel.fetchAllByViewer(ctx.viewer, args)
  }
}
