import { Context, MutationInput } from '../types'
import { UserModel } from '../../models/user'

export default {
  async authenticate(
    _root,
    args: MutationInput<{ email: string; password: string }>,
    ctx: Context
  ): Promise<{ token: string }> {
    return UserModel.authenticate(ctx.viewer, args.input)
  }
}
