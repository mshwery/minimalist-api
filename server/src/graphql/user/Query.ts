import { Context } from '../types'
import { User, UserModel } from '../../models/user'

export default {
  async me(_root: EmptyObject, _args: EmptyObject, ctx: Context): Promise<User | null> {
    return UserModel.fetchByViewer(ctx.viewer)
  },
}
