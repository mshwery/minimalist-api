import { getCustomRepository } from 'typeorm'
import { ListRepository } from '../../models/list'

export default {
  Query: {
    lists(_root, _args, ctx) {
      const repo = getCustomRepository(ListRepository)
      return repo.allByAuthor(ctx.viewer.id)
    }
  },
  Mutation: {}
}
