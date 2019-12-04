import { getRepository } from 'typeorm'
import Chance from 'chance'
import { List, ListModel } from '../../list'
import { UserModel } from '../../user'
import { sendEmail } from '../../../lib/mailer'
jest.mock('../../../lib/mailer')

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

    it('should return the list if the user created the list', async () => {
      const ogList = await createList({
        name: 'Test list',
        createdBy: viewer
      })

      const list = await ListModel.fetch(viewer, ogList.id!)
      expect(list).toEqual(expect.objectContaining(ogList))
    })

    it('should return the list if the list is shared with the user', async () => {
      const ogList = await createList({
        name: 'Shared list',
        createdBy: viewer
      })

      const { email } = (await UserModel.fetchByViewer(nonViewer))!
      await ListModel.addUser(viewer, ogList.id!, email)

      const list = await ListModel.fetch(nonViewer, ogList.id!)
      expect(list).toEqual(expect.objectContaining(ogList))
    })

    it('should return tasks when asked to', async () => {
      const ogList = await createList({
        name: 'List with tasks',
        createdBy: viewer
      })

      const list = await ListModel.fetch(viewer, ogList.id!, { withTasks: true })
      expect(list).toEqual(expect.objectContaining(ogList))
      expect(list).toHaveProperty('tasks')
      expect(list!.tasks).toEqual(expect.arrayContaining([]))
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

  describe('addUser', () => {
    it('should throw if no valid email is provided', async () => {
      const list = await createList({
        name: 'addUser test',
        createdBy: viewer
      })

      await expect(ListModel.addUser(viewer, list.id!, '')).rejects.toThrow(/Valid email is required./)
    })

    it('should throw if no list can be found', async () => {
      const nonExistentList = chance.guid({ version: 4 })
      await expect(ListModel.addUser(viewer, nonExistentList, 'me@example.com')).rejects.toThrow(
        /No list found with id/
      )
    })

    it('should throw if you arent the list owner', async () => {
      const list = await createList({
        name: 'addUser test',
        createdBy: nonViewer
      })

      // Have to share the list in order for us to get to this error
      const { email } = (await UserModel.fetchByViewer(viewer))!
      await ListModel.addUser(nonViewer, list.id!, email)

      await expect(ListModel.addUser(viewer, list.id!, 'me@example.com')).rejects.toThrow(
        /You cannot add users to lists you do not own./
      )
    })

    it('should send an email to the invited user', async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      // Have to share the list in order for us to get to this error
      await ListModel.addUser(viewer, list.id!, 'me@example.com')
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'me@example.com'
        })
      )
    })
  })

  describe('removeUser', () => {
    it('should throw if no list can be found', async () => {
      const nonExistentList = chance.guid({ version: 4 })
      await expect(ListModel.removeUser(viewer, nonExistentList, 'me@example.com')).rejects.toThrow(
        /No list found with id/
      )
    })

    it('should throw if you try to remove the list owner', async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      const { email } = (await UserModel.fetchByViewer(viewer))!

      await expect(ListModel.removeUser(viewer, list.id!, email)).rejects.toThrow(
        /You cannot remove the list owner from a list./
      )
    })

    it('should throw if non-owners try to remove other users', async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      // Must share the list for this error to happen
      const otherUser = (await UserModel.fetchByViewer(nonViewer))!
      await ListModel.addUser(viewer, list.id!, otherUser.email)

      // Removed user must exist to encounter this error, so let's create it first
      await UserModel.create(viewer, {
        email: 'rando@example.com',
        password: chance.string({ length: 8 })
      })

      await expect(ListModel.removeUser(otherUser.id, list.id!, 'rando@example.com')).rejects.toThrow(
        /You cannot remove users from lists you do not own./
      )
    })

    it("should remove the user's access to the list", async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      // Share the list first
      const otherUser = (await UserModel.fetchByViewer(nonViewer))!
      await ListModel.addUser(viewer, list.id!, otherUser.email)

      // Prove they have access
      await expect(ListModel.fetch(otherUser.id, list.id!)).resolves.toEqual(expect.objectContaining(list))

      // Remove user's access
      await ListModel.removeUser(viewer, list.id!, otherUser.email)

      // Prove they no longer have access
      await expect(ListModel.fetch(otherUser.id, list.id!)).resolves.toEqual(null)
    })
  })

  describe('leaveList', () => {
    it("should throw if the list doesn't exist", async () => {
      const nonExistentList = chance.guid({ version: 4 })
      await expect(ListModel.leaveList(viewer, nonExistentList)).rejects.toThrow(/No list found with id/)
    })

    it("should throw if the user doesn't have access to the list", async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: nonViewer
      })

      await expect(ListModel.leaveList(viewer, list.id!)).rejects.toThrow(/No list found with id/)
    })

    it('should throw if the user is trying to leave a list they created', async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      await expect(ListModel.leaveList(viewer, list.id!)).rejects.toThrow(/You cannot leave a list you own./)
    })

    it("should remove the user's access to the list", async () => {
      const list = await createList({
        name: 'Email test',
        createdBy: viewer
      })

      // Share the list first
      const otherUser = (await UserModel.fetchByViewer(nonViewer))!
      await ListModel.addUser(viewer, list.id!, otherUser.email)

      // Prove they have access
      await expect(ListModel.fetch(otherUser.id, list.id!)).resolves.toEqual(expect.objectContaining(list))

      // Remove user's access
      await ListModel.leaveList(otherUser.id, list.id!)

      // Prove they no longer have access
      await expect(ListModel.fetch(otherUser.id, list.id!)).resolves.toEqual(null)
    })
  })
})
