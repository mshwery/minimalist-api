import { getRepository } from 'typeorm'
import Chance from 'chance'
import { sortBy } from 'lodash'
import { Task, TaskModel } from '../'
import { List } from '../../list'
import { UserModel } from '../../user'

const chance = new Chance()
const viewer = chance.guid({ version: 4 })
const nonViewer = chance.guid({ version: 4 })
const allTasks: string[] = []
const lists: string[] = []

async function createList(attrs: Partial<List>): Promise<List> {
  const repo = getRepository(List)
  const list = await repo.save(repo.create(attrs))
  lists.push(list.id!)
  return list
}

async function createTask(attrs: Partial<Task>): Promise<Task> {
  const repo = getRepository(Task)
  const task = await repo.save(repo.create(attrs))
  allTasks.push(task.id!)
  return task
}

describe('TaskModel', () => {
  beforeAll(async () => {
    // create a user for the tests
    await Promise.all([
      UserModel.create(viewer, {
        id: viewer,
        email: chance.email({ domain: 'example.com' }),
        password: chance.string({ length: 8 })
      }),
      UserModel.create(viewer, {
        id: nonViewer,
        email: chance.email({ domain: 'example.com' }),
        password: chance.string({ length: 8 })
      })
    ])
  })

  afterEach(async () => {
    if (allTasks.length > 0) {
      await getRepository(Task).delete(allTasks)
    }

    if (lists.length > 0) {
      await getRepository(List).delete(lists)
    }
  })

  afterAll(async () => {
    await UserModel.delete(viewer, viewer)
  })

  describe('fetch', () => {
    it('should return null when no viewer is provided', async () => {
      const task = await TaskModel.fetch(undefined, 'doesnt matter what this is')
      expect(task).toBe(null)
    })

    it('should return null if the task does not exist', async () => {
      const fakeTaskId = chance.guid({ version: 4 })
      const task = await TaskModel.fetch(viewer, fakeTaskId)
      expect(task).toBe(null)
    })

    it('should return null when the provided viewer doesnt have access to the task and it is not associated with a list', async () => {
      const { id } = await createTask({
        content: 'task with no list association',
        createdBy: nonViewer
      })

      const task = await TaskModel.fetch(viewer, id!)
      expect(task).toBe(null)
    })

    it('should return null when the provided viewer doesnt have access to the tasks associated list', async () => {
      const list = await createList({
        name: 'Test list',
        createdBy: nonViewer
      })

      const ogTask = await createTask({
        content: 'task with no list association',
        createdBy: nonViewer,
        list
      })

      const task = await TaskModel.fetch(viewer, ogTask.id!)
      expect(task).toBe(null)
    })

    it('should return the task if the user has access', async () => {
      let ogTask = await createTask({
        content: 'test task',
        createdBy: viewer
      })

      let task = await TaskModel.fetch(viewer, ogTask.id!)
      expect(task).toEqual(expect.objectContaining(ogTask))

      const list = await createList({
        name: 'Test list',
        createdBy: viewer
      })

      ogTask = await createTask({
        content: 'task with list association',
        createdBy: nonViewer,
        list
      })

      task = await TaskModel.fetch(viewer, ogTask.id!)
      expect(task).toEqual(expect.objectContaining(ogTask))
    })
  })

  describe('moveTask', () => {
    it('should throw if the associated list cannot be found', async () => {
      const args = {
        id: chance.guid({ version: 4 }),
        listId: chance.guid({ version: 4 }),
        insertBefore: 10
      }

      await expect(TaskModel.moveTask(viewer, args)).rejects.toThrowError(/No list found with id/)
    })

    it('should throw if the associated list cannot be access by the viewer', async () => {
      const list = await createList({
        name: 'moveTask list',
        createdBy: nonViewer
      })

      const task = await createTask({
        content: 'moveTask test',
        createdBy: nonViewer,
        list
      })

      const args = {
        id: task.id!,
        listId: task.listId!,
        insertBefore: 10
      }

      await expect(TaskModel.moveTask(viewer, args)).rejects.toThrowError(/No list found with id/)
    })

    it('should throw if the task cannot be found', async () => {
      const list = await createList({
        name: 'moveTask list',
        createdBy: viewer
      })

      const args = {
        id: chance.guid({ version: 4 }),
        listId: list.id!,
        insertBefore: 10
      }

      await expect(TaskModel.moveTask(viewer, args)).rejects.toThrowError(/No task found with id/)
    })

    it('should not change the order if the item is already in the position', async () => {
      const list = await createList({
        name: 'moveTask list',
        createdBy: viewer
      })

      const [task1, task2] = await Promise.all([
        createTask({
          content: 'moveTask test1',
          createdBy: viewer,
          sortOrder: 1,
          list
        }),
        createTask({
          content: 'moveTask test2',
          createdBy: viewer,
          sortOrder: 2,
          list
        })
      ])

      expect(task1.sortOrder).toEqual(1)
      expect(task2.sortOrder).toEqual(2)

      // Move the item to where it already is!
      await TaskModel.moveTask(viewer, {
        id: task1.id!,
        listId: list.id!,
        insertBefore: 1
      })

      const tasks = await TaskModel.fetchAllByList(viewer, list.id!)
      const sorted = sortBy(tasks, 'sortOrder')

      expect(sorted[0].id).toEqual(task1.id)
      expect(sorted[0].sortOrder).toEqual(1)
      expect(sorted[1].id).toEqual(task2.id)
      expect(sorted[1].sortOrder).toEqual(2)
    })
  })
})
