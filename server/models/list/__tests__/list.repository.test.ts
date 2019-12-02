import Chance from 'chance'
import { getRepository, getCustomRepository } from 'typeorm'
import { List, ListRepository } from '../'
import { User, UserRepository } from '../../user'

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
      password: chance.string({ length: 8 })
    })
    const other = repo.create({
      id: otherPersonId,
      email: chance.email({ domain: 'example.com' }),
      password: chance.string({ length: 8 })
    })

    await repo.save([author, other])
  })

  beforeEach(async () => {
    await deleteLists()
  })

  describe('allByViewer', () => {
    it('should return only lists created by the given user', async () => {
      const repo = getCustomRepository(ListRepository)

      await Promise.all([
        createList({ name: 'author list', createdBy: authorId }),
        createList({ name: 'other person list', createdBy: otherPersonId })
      ])

      const lists = await repo.allByViewer(authorId)

      expect(lists.length).toBe(1)
      expect(lists[0].name).toBe('author list')
    })

    it('should return lists by ids', async () => {
      const repo = getCustomRepository(ListRepository)

      const [, list2] = await Promise.all([
        createList({ name: 'author list', createdBy: authorId }),
        createList({ name: 'another author list', createdBy: authorId })
      ])

      const lists = await repo.allByViewer(authorId, { ids: [list2.id!] })

      expect(lists.length).toBe(1)
      expect(lists[0]).toEqual(list2)
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

  describe('addUserToList', () => {
    it('should create a user when none exists by a given email', async () => {
      const listRepo = getCustomRepository(ListRepository)
      const userRepo = getCustomRepository(UserRepository)

      let user = await userRepo.findOne({ email: 'shared@example.com' })
      const list = await createList({ name: 'Shared List', createdBy: authorId })
      expect(user).not.toBeDefined()

      await listRepo.addUserToList('shared@example.com', list.id!)

      user = await userRepo.findOneOrFail({ email: 'shared@example.com' })
      expect(user).toBeDefined()
    })

    it('should give the user access to the list', async () => {
      const listRepo = getCustomRepository(ListRepository)
      const userRepo = getCustomRepository(UserRepository)
      const list = await createList({ name: 'Shared List', createdBy: authorId })

      await listRepo.addUserToList('shared@example.com', list.id!)

      const user = await userRepo.findOneOrFail(
        {
          email: 'shared@example.com'
        },
        {
          relations: ['lists']
        }
      )

      expect(user.lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: list.id
          })
        ])
      )
    })
  })

  describe('removeUserFromList', () => {
    it("should remove the user's access to the list", async () => {
      const listRepo = getCustomRepository(ListRepository)
      const userRepo = getCustomRepository(UserRepository)

      // Giveth access
      const list = await createList({ name: 'Shared List', createdBy: authorId })
      await listRepo.addUserToList('shared@example.com', list.id!)
      let user = await userRepo.findOneOrFail(
        { email: 'shared@example.com' },
        {
          relations: ['lists']
        }
      )

      // (double check that it worked)
      expect(user.lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: list.id
          })
        ])
      )

      // Taketh away
      await listRepo.removeUserFromList(user.id!, list.id!)
      user = await userRepo.findOneOrFail({ email: 'shared@example.com' }, { relations: ['lists'] })

      expect(user.lists).toEqual([])
    })
  })
})
