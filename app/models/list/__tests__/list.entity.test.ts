import { List } from '../list.entity'

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
})
