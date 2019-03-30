import { Context } from '../types'
import { List } from '../../models/list'
import { Task, TaskModel } from '../../models/task'

export default {
  async tasks(list: List, _args, ctx: Context): Promise<Task[]> {
    return list.tasks || TaskModel.fetchAllByList(ctx.viewer, list.id!)
  }
}
