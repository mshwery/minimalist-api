import Chance from 'chance'
import Task from '../task.entity'

const chance = new Chance()

describe('Task', () => {
  describe('isCompleted', () => {
    it('should return false when the task has no completion date', () => {
      const task = new Task()
      task.content = 'test task'

      expect(task.isCompleted).toBe(false)
    })

    it('should true false when the task has a completion date', () => {
      const task = new Task()
      task.content = 'test task'
      task.completedAt = new Date()

      expect(task.isCompleted).toBe(true)
    })

    it('should set the completion date when changed to `true`', () => {
      const task = new Task()
      task.content = 'test task'
      task.isCompleted = true

      expect(task.completedAt).not.toBeUndefined()
      expect(task.completedAt).toBeInstanceOf(Date)
    })

    it('should remove the completion date when changed to `false`', () => {
      const task = new Task()
      task.content = 'test task'
      task.isCompleted = true

      expect(task.completedAt).toBeInstanceOf(Date)

      task.isCompleted = false
      expect(task.completedAt).toBe(null)
    })
  })

  describe('validate', () => {
    it('should throw when a list has invalid values', async () => {
      const task = new Task()
      await expect(task.validate()).rejects.toThrowError(/Invalid data. Check "errors" for more details./)
    })

    it('should not throw when a list has valid values', async () => {
      const task = new Task()
      task.content = ''
      task.createdBy = chance.guid({ version: 4 })

      await expect(task.validate()).resolves.not.toThrow()
    })
  })
})
