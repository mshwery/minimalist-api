import { Context, ListStatus } from '../types'
import { List, ListModel } from '../../models/list'

export default {
  async list(_root: EmptyObject, args: { id: string }, ctx: Context): Promise<List | null> {
    return ListModel.fetch(ctx.viewer, args.id)
  },

  async lists(_root: EmptyObject, args: { status?: ListStatus }, ctx: Context): Promise<List[]> {
    return ListModel.fetchAllByViewer(ctx.viewer, args)
  },
}
