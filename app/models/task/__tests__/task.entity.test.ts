import Task from '../task.entity'

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
})
