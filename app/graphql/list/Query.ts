import { Context } from '../types'
import { List, ListModel } from '../../models/list'

export default {
  async list(_root, args: { id: string }, ctx: Context): Promise<List | null> {
    return ListModel.fetch(ctx.viewer, args.id)
  },

  async lists(_root, args: { ids: string[] }, ctx: Context): Promise<List[]> {
    return ListModel.fetchAllByViewer(ctx.viewer, args.ids)
  }
}
