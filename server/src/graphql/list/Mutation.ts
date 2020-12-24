import { Context, MutationInput } from '../types'
import { List, ListModel } from '../../models/list'

export default {
  async createList(_root: unknown, args: MutationInput<{ name: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.create(ctx.viewer, { name: args.input.name })
    return { list }
  },

  async renameList(_root: unknown, args: MutationInput<{ id: string; name: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.update(ctx.viewer, args.input.id, { name: args.input.name })
    return { list }
  },

  async archiveList(_root: unknown, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.archive(ctx.viewer, args.input.id)
    return { list }
  },

  async unarchiveList(_root: unknown, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.unarchive(ctx.viewer, args.input.id)
    return { list }
  },

  async deleteList(_root: unknown, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ id: string }> {
    const id = args.input.id
    await ListModel.delete(ctx.viewer, id)
    return { id }
  },

  // TODO: return list collaborators instead of list?
  async shareList(_root: unknown, args: MutationInput<{ id: string; email: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.addUser(ctx.viewer, args.input.id, args.input.email)
    return { list }
  },

  // TODO: return list collaborators instead of list?
  async unshareList(_root: unknown, args: MutationInput<{ id: string; email: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.removeUser(ctx.viewer, args.input.id, args.input.email)
    return { list }
  },

  async leaveList(_root: unknown, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ success: boolean }> {
    const list = await ListModel.leaveList(ctx.viewer, args.input.id)
    return { success: !!list }
  },
}
