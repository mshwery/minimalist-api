import { Context, MutationInput } from '../types'
import { Task, TaskModel } from '../../models/task'

export default {
  async createTask(
    _root: EmptyObject,
    args: MutationInput<{ content: string; id?: string; insertAt?: number; listId?: string }>,
    ctx: Context
  ): Promise<{ task: Task }> {
    const task = await TaskModel.create(ctx.viewer, args.input)

    return { task }
  },

  async updateTask(
    _root: EmptyObject,
    args: MutationInput<{ id: string; content?: string; isCompleted?: boolean; completedAt?: string }>,
    ctx: Context
  ): Promise<{ task: Task }> {
    const task = await TaskModel.update(ctx.viewer, args.input.id, args.input)
    return { task }
  },

  async completeTask(_root: EmptyObject, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ task: Task }> {
    const task = await TaskModel.markComplete(ctx.viewer, args.input.id)
    return { task }
  },

  async reopenTask(_root: EmptyObject, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ task: Task }> {
    const task = await TaskModel.markIncomplete(ctx.viewer, args.input.id)
    return { task }
  },

  async deleteTask(_root: EmptyObject, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ id: string }> {
    const id = args.input.id
    await TaskModel.delete(ctx.viewer, id)
    return { id }
  },

  async moveTask(
    _root: EmptyObject,
    args: MutationInput<{ listId: string; id: string; insertBefore: number }>,
    ctx: Context
  ): Promise<{ task: Task }> {
    const task = await TaskModel.moveTask(ctx.viewer, args.input)

    return {
      task,
    }
  },

  async scheduleTask(
    _root: EmptyObject,
    args: MutationInput<{ id: string; due: string | null }>,
    ctx: Context
  ): Promise<{ task: Task }> {
    const task = await TaskModel.scheduleTask(ctx.viewer, args.input)
    return { task }
  },
}
