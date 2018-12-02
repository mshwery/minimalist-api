import { getCustomRepository } from 'typeorm'
import initConnection from '../../../lib/database'
import { ListRepository } from '../list.repository'

describe('ListRepository', () => {
  beforeAll(async done => {
    await initConnection()
    done()
  })

  afterAll(async done => {
    await getCustomRepository(ListRepository).clear()
    done()
  })

  describe('allByAuthor', () => {
    it('should return only lists created by the given user', async () => {
      const repo = getCustomRepository(ListRepository)

      const listByAuthor = repo.create({ name: 'test-list', createdBy: 'author' })
      const listByOther = repo.create({ name: 'test-list2', createdBy: 'other' })

      await repo.save([listByAuthor, listByOther])

      const lists = await repo.allByAuthor('author')

      expect(lists.length).toBe(1)
      expect(lists[0].name).toBe('test-list')
    })
  })
})
