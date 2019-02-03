import { BadRequest, Forbidden, NotFound, Unauthorized } from 'http-errors'
import { sortBy } from 'lodash'
import { getCustomRepository } from 'typeorm'
import { Viewer, UUID } from '../../types'
import { canViewList, canEditList, ListModel } from '../list'
import Task from './task.entity'
import TaskRepository from './task.repository'

export { Task, TaskRepository }

export async function canViewTask(viewer: Viewer, task: Task): Promise<boolean> {
  if (!viewer) {
    return false
  }

  if (task.createdBy === viewer) {
    return true
  }

  if (task.listId) {
    // if an associated list hasn't been prefetched let's fetch it now
    const list = task.list || (await ListModel.fetch(viewer, task.listId))
    if (list && canViewList(viewer, list)) {
      return true
    }
  }

  return false
}

export async function canEditTask(viewer: Viewer, task: Task): Promise<boolean> {
  // for now, anyone who can view a task can edit it
  return canViewTask(viewer, task)
}

export class TaskModel {
  /**
   * Gets a task if the viewer has access to it
   */
  static async fetch(viewer: Viewer, id: UUID): Promise<Task | null> {
    if (!viewer) {
      return null
    }

    // load the task, and it's associated list (we have to see if the viewer has access to the list or the task)
    const task = await getCustomRepository(TaskRepository).findOne(id, { relations: ['list'] })
    if (!task) {
      return null
    }

    return (await canViewTask(viewer, task)) ? task : null
  }

  /**
   * Gets all tasks associated with a list
   */
  static async fetchAllByList(viewer: Viewer, listId: UUID): Promise<Task[]> {
    if (!viewer) {
      return []
    }

    // TODO: fetch just the tasks?
    // TODO: fetch the list via DataLoaders
    const list = await ListModel.fetch(viewer, listId, { withTasks: true })
    if (!list) {
      throw new NotFound(`No list found with id "${listId}"`)
    }

    return list.tasks!
  }

  /**
   * Gets all tasks that a viewer has access to
   */
  static async fetchAllByViewer(viewer: Viewer, ids?: UUID[]): Promise<Task[]> {
    if (!viewer) {
      return []
    }

    return getCustomRepository(TaskRepository).allByAuthor(viewer, ids)
  }

  /**
   * Creates a task for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async create(
    viewer: Viewer,
    attrs: { content?: string; completedAt?: Date | string | null; isCompleted?: boolean; listId?: UUID | null }
  ): Promise<Task> {
    if (!viewer) {
      throw new Unauthorized(`Must be logged in create tasks.`)
    }

    // @todo real validation
    if (!attrs.content) {
      throw new BadRequest(`Must provide a value for "content".`)
    }

    // validate that the viewer can edit the list they are trying to add a task to
    if (attrs.listId) {
      const list = await ListModel.fetch(viewer, attrs.listId)
      if (!list || !canEditList(viewer, list)) {
        throw new Forbidden(`You don't have access to add tasks to the list with id "${attrs.listId}".`)
      }
    }

    return getCustomRepository(TaskRepository).apply(new Task(), {
      ...attrs,
      createdBy: viewer
    })
  }

  /**
   * Updates a task for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async update(viewer: Viewer, id: UUID, attrs: Partial<Task>): Promise<Task> {
    const task = await TaskModel.fetch(viewer, id)
    if (!task) {
      throw new NotFound(`No task found with id "${id}"`)
    }

    return getCustomRepository(TaskRepository).apply(task, attrs)
  }

  /**
   * Marks a task complete for the viewer
   */
  static async markComplete(viewer: Viewer, id: UUID): Promise<Task> {
    const task = await TaskModel.fetch(viewer, id)
    if (!task) {
      throw new NotFound(`No task found with id "${id}"`)
    }

    return getCustomRepository(TaskRepository).markComplete(task)
  }

  /**
   * Marks a task incomplete for the viewer
   */
  static async markIncomplete(viewer: Viewer, id: UUID): Promise<Task> {
    const task = await TaskModel.fetch(viewer, id)
    if (!task) {
      throw new NotFound(`No task found with id "${id}"`)
    }

    return getCustomRepository(TaskRepository).markIncomplete(task)
  }

  /**
   * Deletes a task if the viewer has access
   */
  static async delete(viewer: Viewer, id: UUID): Promise<void> {
    const task = await TaskModel.fetch(viewer, id)

    if (!task || !(await canEditTask(viewer, task))) {
      throw new Forbidden(`Cannot delete tasks that you don't have access to.`)
    }

    await getCustomRepository(TaskRepository).delete(id)
  }

  /**
   * Move a single task by id
   */
  static async moveTask(viewer: Viewer, args: { id: UUID; listId: UUID; insertBefore: number }): Promise<Task> {
    // Get all the tasks so we know which ones we have to reorder
    const tasks = await TaskModel.fetchAllByList(viewer, args.listId)

    // Find the task we need to move
    const task = tasks.find(t => t.id === args.id)

    if (!task) {
      throw new NotFound(`No task found with id "${args.id}"`)
    }

    const sortedTasks = sortBy(tasks, 'itemOrder')
    const fromIndex = sortedTasks.indexOf(task)

    // Reorder the tasks and update their `itemOrder`
    const newSortedTasks = move(sortedTasks, fromIndex, args.insertBefore).map((t, index) => {
      t.itemOrder = index + 1
      return t
    })

    // TODO: persist tasks that changed

    return task
  }
}

function move<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const arr = Array.from(items)
  const item = arr.splice(fromIndex, 1)[0]
  arr.splice(toIndex, 0, item)
  return arr
}
