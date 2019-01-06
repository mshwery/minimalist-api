import Chance from 'chance'
import { getRepository } from 'typeorm'
import { UserModel, User } from '../'

const chance = new Chance()
const viewer = chance.guid({ version: 4 })
const email = chance.email({ domain: 'example.com' })
const password = chance.string({ length: 8 })

describe('UserModel', () => {
  beforeAll(async () => {
    await UserModel.create(viewer, {
      id: viewer,
      email,
      password
    })
  })

  afterAll(async () => {
    await getRepository(User).clear()
  })

  describe('fetchByViewer', () => {
    it('should return null when no viewer is provided', async () => {
      const user = await UserModel.fetchByViewer(undefined)
      expect(user).toBe(null)
    })

    it('should return null when the provided viewer doesnt match any known users', async () => {
      const unknownUser = chance.guid({ version: 4 })
      const user = await UserModel.fetchByViewer(unknownUser)
      expect(user).toBe(null)
    })

    it('should return the user when the provided viewer matches', async () => {
      const user = await UserModel.fetchByViewer(viewer)
      expect(user).toEqual(
        expect.objectContaining({
          id: viewer,
          email
        })
      )
    })
  })

  describe('create', () => {
    it('should create a user', async () => {
      const attrs = {
        email: chance.email({ domain: 'example.com' }),
        password
      }

      await expect(UserModel.create(viewer, attrs)).resolves.not.toThrow()
    })

    it('should throw if a user with the same email address already exists', async () => {
      const existingAttrs = {
        email,
        password
      }

      await expect(UserModel.create(viewer, existingAttrs)).rejects.toThrow(
        /A user with this email address already exists./
      )
    })
  })

  describe('delete', () => {
    it('should allow the viewer to delete their own user', async () => {
      const user = await UserModel.create(undefined, {
        email: chance.email({ domain: 'example.com' }),
        password
      })
      await expect(UserModel.delete(user.id, user.id!)).resolves.not.toThrow()
    })

    it('should throw if the viewer attempts to delete a different user', async () => {
      const user = await UserModel.create(viewer, { email: chance.email({ domain: 'example.com' }), password })
      await expect(UserModel.delete(viewer, user.id!)).rejects.toThrow(
        /Cannot delete user accounts other than your own./
      )
    })
  })
})
