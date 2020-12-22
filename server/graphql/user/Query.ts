import { Context } from '../types'
import { User, UserModel } from '../../models/user'

export default {
  async me(_root, _args, ctx: Context): Promise<User | null> {
    return UserModel.fetchByViewer(ctx.viewer)
  },
}
