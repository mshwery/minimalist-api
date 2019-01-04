import { IContext, IMutationInput } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
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
}
