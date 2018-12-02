import { getRepository } from 'typeorm'
import { User } from '../user.entity'
import { comparePassword } from '../../../lib/auth'

describe('User', () => {
  describe('password', () => {
    it('should be hashed', async () => {
      const repo = getRepository(User)
      const user = repo.create({
        email: 'test@example.com',
        password: 'ya boring'
      })

      await repo.save(user)
      expect(user.password).not.toBe('ya boring')

      const isMatch = await comparePassword('ya boring', user.password)
      expect(isMatch).toBe(true)
    })

    it('should update the hash if the password changes', async () => {
      const repo = getRepository(User)
      let user = repo.create({
        email: 'updated@example.com',
        password: 'ya boring'
      })

      await repo.save(user)

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
})
