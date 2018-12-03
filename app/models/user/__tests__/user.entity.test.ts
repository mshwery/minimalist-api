import { getRepository } from 'typeorm'
import { User } from '../user.entity'
import { comparePassword } from '../../../lib/auth'

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
        email: 'test@example.com',
        password: 'ya boring'
      })

      expect(user.password).not.toBe('ya boring')

      const isMatch = await comparePassword('ya boring', user.password)
      expect(isMatch).toBe(true)
    })

    it('should update the hash if the password changes', async () => {
      const repo = getRepository(User)
      let user = await createUser({
        email: 'updated@example.com',
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
      await createUser({
        email: 'taken@example.com',
        password: 'passwerd'
      })

      await createUser({
        email: 'taken@example.com',
        password: 'passwerd'
      }).catch(error => {
        expect(error.detail).toBeDefined()
        expect(error.detail.includes('already exists')).toBe(true)
      })
    })
  })
})
