import Chance from 'chance'
import { getRepository, getCustomRepository } from 'typeorm'
import { List, ListRepository } from '../'
import { User } from '../../user'

const chance = new Chance()

const authorId = chance.guid({ version: 4 })
const otherPersonId = chance.guid({ version: 4 })

const createdLists: string[] = []

async function createList(attrs: Partial<List>): Promise<List> {
  const repo = getRepository(List)
  const list = repo.create(attrs)
  await repo.save(list)

  createdLists.push(list.id!)
  return list
}

async function deleteLists(): Promise<void> {
  if (createdLists.length > 0) {
    await getRepository(List).delete(createdLists)
  }
}

describe('ListRepository', () => {
  beforeAll(async () => {
    // create two users for these tests
    const repo = getRepository(User)

    const author = repo.create({
      id: authorId,
      email: chance.email({ domain: 'example.com' }),
      password: 'foobar'
    })
    const other = repo.create({
      id: otherPersonId,
      email: chance.email({ domain: 'example.com' }),
      password: 'foobar'
    })

    await repo.save([author, other])
  })

  beforeEach(async () => {
    await deleteLists()
  })

  describe('fetch', () => {
    it('should return the list if the viewer created it', async () => {
      const listCreatedByViewer = await createList({ name: 'author list', createdBy: authorId })
      const list = await getCustomRepository(ListRepository).fetch(authorId, listCreatedByViewer.id!)
      expect(list).toEqual(listCreatedByViewer)
    })

    it('should return null if the viewer did not create it', async () => {
      const listCreatedBySomeoneElse = await createList({ name: 'author list', createdBy: otherPersonId })
      const list = await getCustomRepository(ListRepository).fetch(authorId, listCreatedBySomeoneElse.id!)
      expect(list).toEqual(null)
    })

    it('should return null if no viewer is provided', async () => {
      const listCreatedByViewer = await createList({ name: 'author list', createdBy: authorId })
      const list = await getCustomRepository(ListRepository).fetch(undefined, listCreatedByViewer.id!)
      expect(list).toEqual(null)
    })
  })

  describe('allByAuthor', () => {
    it('should return only lists created by the given user', async () => {
      const repo = getCustomRepository(ListRepository)

      await Promise.all([
        createList({ name: 'author list', createdBy: authorId }),
        createList({ name: 'other person list', createdBy: otherPersonId })
      ])

      const lists = await repo.allByAuthor(authorId)

      expect(lists.length).toBe(1)
      expect(lists[0].name).toBe('author list')
    })
  })

  describe('changeName', () => {
    it('should update the name of a list', async () => {
      const repo = getCustomRepository(ListRepository)

      let list = await createList({ name: 'list', createdBy: authorId })
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

      let list = await createList({ name: 'list', createdBy: authorId })
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

      let list = await createList({ name: 'list', createdBy: authorId, archivedAt: new Date() })
      expect(list.isArchived).toBe(true)
      expect(list.archivedAt).not.toBeNull()

      await repo.unarchive(list)

      list = await repo.findOneOrFail(list.id)
      expect(list.isArchived).toBe(false)
      expect(list.archivedAt).toBeNull()
    })
  })
})
