import { IContext, IMutationInput } from '../types'
import { List, ListModel } from '../../models/list'

export default {
  async createList(_root, args: IMutationInput<{ name: string }>, ctx: IContext): Promise<{ list: List }> {
    const list = await ListModel.create(ctx.viewer, { name: args.input.name })
    return { list }
  },

  async renameList(_root, args: IMutationInput<{ id: string; name: string }>, ctx: IContext): Promise<{ list: List }> {
    const list = await ListModel.update(ctx.viewer, args.input.id, { name: args.input.name })
    return { list }
  },

  async archiveList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ list: List }> {
    const list = await ListModel.archive(ctx.viewer, args.input.id)
    return { list }
  },

  async unarchiveList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ list: List }> {
    const list = await ListModel.unarchive(ctx.viewer, args.input.id)
    return { list }
  },

  async deleteList(_root, args: IMutationInput<{ id: string }>, ctx: IContext): Promise<{ id: string }> {
    const id = args.input.id
    await ListModel.delete(ctx.viewer, id)
    return { id }
  }
}
