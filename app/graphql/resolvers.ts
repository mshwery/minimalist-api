import { Unauthorized } from 'http-errors'
import { getCustomRepository, getRepository } from 'typeorm'
import { List, ListRepository } from '../models/list'
import { User } from '../models/user'

interface IContext {
  viewer?: string | undefined
}

function requireAuth(ctx: IContext): void {
  if (!ctx.viewer) {
    throw new Unauthorized()
  }
}

async function getAuthorizedList(id: string, viewerId: string): Promise<List | null> {
  const repo = getCustomRepository(ListRepository)
  const list = await repo.findOne({ id })

  if (!list || list.createdBy !== viewerId) {
    return null
  }

  return list
}

const resolvers = {
  Query: {
    async me(_root, _args, { viewer }): Promise<User | undefined | null> {
      if (!viewer) {
        return null
      }

      return getRepository(User).findOne({ id: viewer })
    },

    async list(_root, args, ctx): Promise<List | null> {
      requireAuth(ctx)
      return getAuthorizedList(args.id, ctx.viewer)
    },

    async lists(_root, _args, ctx): Promise<List[]> {
      requireAuth(ctx)
      return getCustomRepository(ListRepository).allByAuthor(ctx.viewer)
    }
  }
}

export default resolvers
