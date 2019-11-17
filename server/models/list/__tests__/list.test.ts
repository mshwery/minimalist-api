import { getRepository } from 'typeorm'
import Chance from 'chance'
import { List, ListModel } from '../../list'
import { UserModel } from '../../user'

const chance = new Chance()
const viewer = chance.guid({ version: 4 })
const nonViewer = chance.guid({ version: 4 })
const lists: string[] = []

async function createList(attrs: Partial<List>): Promise<List> {
  const repo = getRepository(List)
  const list = repo.create(attrs)
  await repo.save(list)
  lists.push(list.id!)
  return list
}

describe('ListModel', () => {
  beforeAll(async () => {
    // create a user for the tests
    await Promise.all([
      UserModel.create(viewer, {
        id: viewer,
        email: chance.email({ domain: 'example.com' }),
        password: chance.string({ length: 8 })
      }),
      UserModel.create(viewer, {
        id: nonViewer,
        email: chance.email({ domain: 'example.com' }),
        password: chance.string({ length: 8 })
      })
    ])
  })

  afterEach(async () => {
    if (lists.length > 0) {
      await getRepository(List).delete(lists)
    }
  })

  afterAll(async () => {
    await UserModel.delete(viewer, viewer)
  })

  describe('fetch', () => {
    it('should return null when no viewer is provided', async () => {
      const list = await ListModel.fetch(undefined, 'doesnt matter what this is')
      expect(list).toBe(null)
    })

    it('should return null if the list does not exist', async () => {
      const fakeListId = chance.guid({ version: 4 })
      const list = await ListModel.fetch(viewer, fakeListId)
      expect(list).toBe(null)
    })

    it('should return null when the provided viewer doesnt have access to the list', async () => {
      const { id } = await createList({
        name: 'someone elses list',
        createdBy: nonViewer
      })

      const list = await ListModel.fetch(viewer, id!)
      expect(list).toBe(null)
    })

    it('should return the list if the user has access', async () => {
      const ogList = await createList({
        name: 'Test list',
        createdBy: viewer
      })

      const list = await ListModel.fetch(viewer, ogList.id!)
      expect(list).toEqual(expect.objectContaining(ogList))
    })
  })

  describe('create', () => {
    it('should create a list', async () => {
      const ogList = await ListModel.create(viewer, { name: 'test list' })
      expect(ogList.id).toBeDefined()

      const list = await ListModel.fetch(viewer, ogList.id!)
      expect(list).toEqual(expect.objectContaining(ogList))
    })
  })

  describe('update', () => {
    it('should update the name of a list', async () => {
      const ogList = await createList({
        name: 'Test list',
        createdBy: viewer
      })

      await ListModel.update(viewer, ogList.id!, { name: 'Renamed list' })

      const list = await ListModel.fetch(viewer, ogList.id!)
      expect(list!.name).toBe('Renamed list')
      expect(list!.updatedAt).not.toEqual(ogList.updatedAt)
    })
  })

  describe('delete', () => {
    it('should delete a list if the viewer has access', async () => {
      const ogList = await createList({
        name: 'Delete Test List',
        createdBy: viewer
      })

      const list = await ListModel.fetch(viewer, ogList.id!)
      expect(list).toEqual(expect.objectContaining(ogList))

      await ListModel.delete(viewer, ogList.id!)

      // list is no more
      await expect(ListModel.fetch(viewer, ogList.id!)).resolves.toEqual(null)
    })

    it('should throw if the viewer does not have access', async () => {
      const list = await createList({
        name: 'Delete Test List',
        createdBy: nonViewer
      })

      await expect(ListModel.delete(viewer, list.id!)).rejects.toThrow(
        /Cannot delete lists that you don't have access to./
      )
    })
  })
})
