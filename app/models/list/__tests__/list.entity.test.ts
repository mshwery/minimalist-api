import Chance from 'chance'
import List from '../list.entity'

const chance = new Chance()
const viewer = chance.guid({ version: 4 })

describe('List', () => {
  describe('isArchived', () => {
    it('should return false when the list has no archive date', () => {
      const list = new List()
      list.name = 'test-list'

      expect(list.isArchived).toBe(false)
    })

    it('should true false when the list has an archive date', () => {
      const list = new List()
      list.name = 'test-list'
      list.archivedAt = new Date()

      expect(list.isArchived).toBe(true)
    })

    it('should set the archived date when changed to `true`', () => {
      const list = new List()
      list.name = 'test-list'
      list.isArchived = true

      expect(list.archivedAt).not.toBeUndefined()
      expect(list.archivedAt).toBeInstanceOf(Date)
    })

    it('should remove the archived date when changed to `false`', () => {
      const list = new List()
      list.name = 'test-list'
      list.isArchived = true

      expect(list.archivedAt).toBeInstanceOf(Date)

      list.isArchived = false

      expect(list.archivedAt).toBe(null)
    })
  })

  describe('validate', () => {
    it('should throw when a list has invalid values', async () => {
      const list = new List()
      list.name = ''
      list.createdBy = viewer

      await expect(list.validate()).rejects.toThrowError(/Invalid data. Check "errors" for more details./)
    })

    it('should not throw when a list has valid values', async () => {
      const list = new List()
      list.name = 'Valid Name'
      list.createdBy = viewer

      await expect(list.validate()).resolves.not.toThrow()
    })
  })
})
