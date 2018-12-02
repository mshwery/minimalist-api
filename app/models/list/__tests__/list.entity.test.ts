import { getRepository } from 'typeorm'
import { List } from '../list.entity'

describe('List', () => {
  describe('isArchived', () => {
    it('should return false when the list has no archive date', () => {
      const repo = getRepository(List)

      const list: List = repo.create({
        name: 'test-list'
      })

      expect(list.isArchived).toBe(false)
    })

    it('should true false when the list has an archive date', () => {
      const repo = getRepository(List)

      const list: List = repo.create({
        name: 'test-list',
        archivedAt: new Date()
      })

      expect(list.isArchived).toBe(true)
    })

    it('should set the archived date when changed to `true`', () => {
      const repo = getRepository(List)

      const list: List = repo.create({
        name: 'test-list'
      })

      list.isArchived = true

      expect(list.archivedAt).not.toBeUndefined()
      expect(list.archivedAt).toBeInstanceOf(Date)
      expect(list.archivedAt).toBeLessThan(Date.now())
    })

    it('should remove the archived date when changed to `false`', () => {
      const repo = getRepository(List)

      const list: List = repo.create({
        name: 'test-list',
        isArchived: true
      })

      list.isArchived = false

      expect(list.archivedAt).toBe(null)
    })
  })
})
