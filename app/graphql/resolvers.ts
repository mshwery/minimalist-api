import { Unauthorized } from 'http-errors'
import { getCustomRepository } from 'typeorm'
import List from '../models/list/list.entity'
import ListRepository from '../models/list/list.repository'
import { User, UserModel } from '../models/user'
import { Viewer } from '../types'

interface IContext {
  viewer: Viewer
}

function requireAuth(ctx: IContext): void {
  if (!ctx.viewer) {
    throw new Unauthorized()
  }
}

const resolvers = {
  Query: {
    async me(_root, _args, ctx: IContext): Promise<User | null> {
      return UserModel.fetchByViewer(ctx.viewer)
    },

    async list(_root, args: { id: string }, ctx: IContext): Promise<List | null> {
      requireAuth(ctx)
      return getCustomRepository(ListRepository).fetch(ctx.viewer, args.id)
    },

    async lists(_root, args: { ids: string[] }, ctx: IContext): Promise<List[]> {
      requireAuth(ctx)
      return getCustomRepository(ListRepository).allByAuthor(ctx.viewer, args.ids)
    }
  }
}

export default resolvers
