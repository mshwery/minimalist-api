import { Context, MutationInput } from '../types'
import { List, ListModel } from '../../models/list'

export default {
  async createList(_root, args: MutationInput<{ name: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.create(ctx.viewer, { name: args.input.name })
    return { list }
  },

  async renameList(_root, args: MutationInput<{ id: string; name: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.update(ctx.viewer, args.input.id, { name: args.input.name })
    return { list }
  },

  async archiveList(_root, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.archive(ctx.viewer, args.input.id)
    return { list }
  },

  async unarchiveList(_root, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ list: List }> {
    const list = await ListModel.unarchive(ctx.viewer, args.input.id)
    return { list }
  },

  async deleteList(_root, args: MutationInput<{ id: string }>, ctx: Context): Promise<{ id: string }> {
    const id = args.input.id
    await ListModel.delete(ctx.viewer, id)
    return { id }
  }
}
