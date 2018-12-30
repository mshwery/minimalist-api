import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../user.repository'
import Chance from 'chance'

const chance = new Chance()

const viewer = chance.guid({ version: 4 })

describe('UserRepository', () => {
  beforeAll(async () => {
    const repo = getCustomRepository(UserRepository)

    // create a user for these tests
    const user = repo.create({
      id: viewer,
      email: 'user@example.com',
      password: 'foobar'
    })

    await repo.save(user)
  })

  afterAll(async () => {
    await getCustomRepository(UserRepository).delete(viewer)
  })

  describe('fetchViewer', () => {
    it('should return null when no viewer is provided', async () => {
      const user = await getCustomRepository(UserRepository).fetchViewer(undefined)
      expect(user).toBe(null)
    })

    it('should return null when the provided viewer doesnt match any known users', async () => {
      const unknownUser = chance.guid({ version: 4 })
      const user = await getCustomRepository(UserRepository).fetchViewer(unknownUser)
      expect(user).toBe(null)
    })

    it('should return the user when the provided viewer matches', async () => {
      const user = await getCustomRepository(UserRepository).fetchViewer(viewer)
      expect(user).toEqual(
        expect.objectContaining({
          id: viewer,
          email: 'user@example.com'
        })
      )
    })
  })
})
