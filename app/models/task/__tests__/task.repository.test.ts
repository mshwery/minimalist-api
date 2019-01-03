import { getRepository, getCustomRepository, In } from 'typeorm'
import Chance from 'chance'
import TaskRepository from '../task.repository'
import { List } from '../../list'
import { User } from '../../user'

const chance = new Chance()
const authorId = chance.guid({ version: 4 })
const otherPersonId = chance.guid({ version: 4 })

describe('TaskRepository', () => {
  beforeAll(async () => {
    const userRepo = getRepository(User)

    // create two users for these tests
    const author = userRepo.create({
      id: authorId,
      email: chance.email({ domain: 'example.com' }),
      password: 'foobar'
    })
    const other = userRepo.create({
      id: otherPersonId,
      email: chance.email({ domain: 'example.com' }),
      password: 'foobar'
    })

    await userRepo.save([author, other])
  })

  afterAll(async () => {
    await getRepository(User).clear()
  })

  afterEach(async () => {
    const taskRepo = getCustomRepository(TaskRepository)
    await taskRepo.delete({ createdBy: In([authorId, otherPersonId]) })
  })

  describe('allByAuthor', () => {
    it('should return tasks created by the given user', async () => {
      const listRepo = getRepository(List)
      const taskRepo = getCustomRepository(TaskRepository)

      const list = listRepo.create({
        name: 'author list',
        createdBy: authorId
      })

      await listRepo.save(list)

      const task1 = taskRepo.create({
        content: 'foo',
        createdBy: authorId,
        list
      })
      const task2 = taskRepo.create({
        content: 'bar',
        createdBy: authorId
      })

      await taskRepo.save([task1, task2])

      const tasks = await taskRepo.allByAuthor(authorId)
      expect(tasks.length).toBe(2)
    })
  })

  describe('markComplete', () => {
    it('should set an completedAt timestamp', async () => {
      const taskRepo = getCustomRepository(TaskRepository)

      const task = taskRepo.create({
        content: 'foo',
        createdBy: authorId
      })

      await taskRepo.save(task)
      expect(task.isCompleted).toBe(false)

      await taskRepo.markComplete(task)
      expect(task.isCompleted).toBe(true)
    })
  })

  describe('markIncomplete', () => {
    it('should unset the completedAt timestamp', async () => {
      const taskRepo = getCustomRepository(TaskRepository)

      const task = taskRepo.create({
        content: 'foo',
        createdBy: authorId,
        completedAt: new Date()
      })

      await taskRepo.save(task)
      expect(task.isCompleted).toBe(true)

      await taskRepo.markIncomplete(task)
      expect(task.isCompleted).toBe(false)
    })
  })

  describe('apply', () => {
    it('should partially apply changes to a model', async () => {
      const taskRepo = getCustomRepository(TaskRepository)

      const task = taskRepo.create({
        content: 'foo',
        createdBy: authorId
      })

      await taskRepo.save(task)
      expect(task.isCompleted).toBe(false)

      await taskRepo.apply(task, {
        isCompleted: true
      })

      expect(task.isCompleted).toBe(true)
    })
  })
})
