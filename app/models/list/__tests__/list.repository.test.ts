import { getRepository, getCustomRepository, Not, IsNull } from 'typeorm'
import { ListRepository } from '../list.repository'
import { User } from '../../user'

const authorId = 'abc76c7c-a2d7-4ad7-928e-2404b026c4ba'
const otherPersonId = '253b681a-e479-4018-9fb9-4976159d2d46'

describe('ListRepository', () => {
  beforeAll(async done => {
    // create two users for these tests
    const repo = getRepository(User)

    const author = repo.create({
      id: authorId,
      email: 'author@example.com',
      password: 'foobar'
    })
    const other = repo.create({
      id: otherPersonId,
      email: 'other@example.com',
      password: 'foobar'
    })

    await repo.save([author, other])

    done()
  })

  afterAll(async done => {
    // cant use `clear` because it calls TRUNCATE which doesn't work on tables w/ foreign keys!
    await getCustomRepository(ListRepository).delete({ id: Not(IsNull()) })
    done()
  })

  describe('allByAuthor', () => {
    it('should return only lists created by the given user', async () => {
      const repo = getCustomRepository(ListRepository)

      const listByAuthor = repo.create({ name: 'author list', createdBy: authorId })
      const listByOther = repo.create({ name: 'other person list', createdBy: otherPersonId })

      await repo.save([listByAuthor, listByOther])

      const lists = await repo.allByAuthor(authorId)

      expect(lists.length).toBe(1)
      expect(lists[0].name).toBe('author list')
    })
  })

  describe('changeName', () => {
    it('should update the name of a list', async () => {
      const repo = getCustomRepository(ListRepository)

      let list = repo.create({ name: 'list', createdBy: authorId })
      await repo.save(list)
      const updatedAt = list.updatedAt

      await repo.changeName(list, 'new name!')

      list = await repo.findOneOrFail(list.id)
      expect(list.name).toBe('new name!')
      expect(list.updatedAt).not.toBe(updatedAt)
      expect(Number(list.updatedAt)).toBeGreaterThan(Number(updatedAt))
    })
  })

  describe('archive', () => {
    it('should set an archivedAt timestamp', async () => {
      const repo = getCustomRepository(ListRepository)

      let list = repo.create({ name: 'list', createdBy: authorId })
      await repo.save(list)
      expect(list.archivedAt).toBeNull()

      const before = Date.now()
      await repo.archive(list)

      list = await repo.findOneOrFail(list.id)
      expect(list.isArchived).toBe(true)
      expect(list.archivedAt).not.toBeNull()
      expect(list.archivedAt).toBeInstanceOf(Date)
      expect(Number(list.archivedAt)).toBeGreaterThanOrEqual(before)
    })
  })

  describe('unarchive', () => {
    it('should unset the archivedAt timestamp', async () => {
      const repo = getCustomRepository(ListRepository)

      let list = repo.create({ name: 'list', createdBy: authorId, archivedAt: new Date() })
      await repo.save(list)
      expect(list.isArchived).toBe(true)
      expect(list.archivedAt).not.toBeNull()

      await repo.unarchive(list)

      list = await repo.findOneOrFail(list.id)
      expect(list.isArchived).toBe(false)
      expect(list.archivedAt).toBeNull()
    })
  })
})
