import Chance from 'chance'
import { getRepository } from 'typeorm'
import User from '../user.entity'
import { comparePassword } from '../../../lib/auth'

const chance = new Chance()
const createdUsers: string[] = []

async function createUser(attrs: Partial<User>): Promise<User> {
  const repo = getRepository(User)
  const user = repo.create(attrs)
  await repo.save(user)

  createdUsers.push(user.id!)

  return user
}

async function deleteUsers(): Promise<void> {
  const repo = getRepository(User)
  await repo.delete(createdUsers)
}

describe('User', () => {
  afterEach(async () => {
    await deleteUsers()
  })

  describe('password', () => {
    it('should be hashed', async () => {
      const user = await createUser({
        email: chance.email({ domain: 'example.com' }),
        password: 'ya boring'
      })

      expect(user.password).not.toBe('ya boring')

      const isMatch = await comparePassword('ya boring', user.password)
      expect(isMatch).toBe(true)
    })

    it('should update the hash if the password changes', async () => {
      const repo = getRepository(User)
      let user = await createUser({
        email: chance.email({ domain: 'example.com' }),
        password: 'ya boring'
      })

      const hashSaved = await comparePassword('ya boring', user.password)
      expect(hashSaved).toBe(true)

      user.password = 'ya basic'
      await repo.save(user)

      user = await repo.findOneOrFail(user.id)
      expect(user.password).not.toBe('ya boring')
      expect(user.password).not.toBe('ya basic')

      const hashUpdated = await comparePassword('ya basic', user.password)
      expect(hashUpdated).toBe(true)
    })
  })

  describe('email', () => {
    it('should fail if the email already is being used by another user', async () => {
      const email = chance.email({ domain: 'example.com' })
      await createUser({
        email,
        password: 'passwerd'
      })

      await createUser({
        email,
        password: 'passwerd'
      }).catch(error => {
        expect(error.detail).toBeDefined()
        expect(error.detail.includes('already exists')).toBe(true)
      })
    })
  })

  describe('validate', () => {
    it('should throw when a user has invalid values', async () => {
      const user = new User()
      user.email = 'not a valid email'
      user.password = '2short'

      await expect(user.validate()).rejects.toThrowError(/Invalid data. Check "errors" for more details./)
    })

    it('should not throw when a user has valid values', async () => {
      const user = new User()
      user.email = chance.email({ domain: 'example.com' })
      user.password = chance.string({ length: 10 })

      await expect(user.validate()).resolves.not.toThrow()
    })
  })
})
