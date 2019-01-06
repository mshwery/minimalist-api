import { getRepository } from 'typeorm'
import Chance from 'chance'
import { Task, TaskModel } from '../'
import { List } from '../../list'
import { UserModel } from '../../user'

const chance = new Chance()
const viewer = chance.guid({ version: 4 })
const nonViewer = chance.guid({ version: 4 })
const tasks: string[] = []
const lists: string[] = []

async function createList(attrs: Partial<List>): Promise<List> {
  const repo = getRepository(List)
  const list = repo.create(attrs)
  await repo.save(list)
  lists.push(list.id!)
  return list
}

async function createTask(attrs: Partial<Task>): Promise<Task> {
  const repo = getRepository(Task)
  const task = repo.create(attrs)
  await repo.save(task)
  tasks.push(task.id!)
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
    if (tasks.length > 0) {
      await getRepository(Task).delete(tasks)
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
      expect(task).toEqual(ogTask)
    })
  })
})
