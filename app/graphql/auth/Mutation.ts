import { IContext, IMutationInput } from '../types'
import { UserModel } from '../../models/user'

export default {
  async authenticate(
    _root,
    args: IMutationInput<{ email: string; password: string }>,
    ctx: IContext
  ): Promise<{ token: string }> {
    return UserModel.authenticate(ctx.viewer, args.input)
  }
}
