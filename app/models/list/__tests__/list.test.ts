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
        password: 'foo'
      }),
      UserModel.create(viewer, {
        id: nonViewer,
        email: chance.email({ domain: 'example.com' }),
        password: 'foo'
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
      expect(list).toEqual(ogList)
    })
  })
})
