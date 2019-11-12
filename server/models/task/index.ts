import { BadRequest, Forbidden, NotFound, Unauthorized } from 'http-errors'
import { getCustomRepository } from 'typeorm'
import { Viewer, UUID } from '../../types'
import { move } from '../../lib/array-move'
import analytics from '../../lib/analytics'
import { canEditList, ListModel } from '../list'
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
    // if the viewer can `fetch` a list they have access
    const list = await ListModel.fetch(viewer, task.listId)
    if (list) {
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
   * Gets all tasks associated with a list (or the inbox)
   */
  static async fetchAllByList(viewer: Viewer, listId: UUID | null): Promise<Task[]> {
    if (!viewer) {
      return []
    }

    if (listId === 'inbox' || listId === null) {
      return getCustomRepository(TaskRepository).allByAuthor(viewer, {
        listId: null
      })
    }

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
  static async fetchAllByViewer(viewer: Viewer, filters: { ids?: UUID[], listId?: UUID }): Promise<Task[]> {
    if (!viewer) {
      return []
    }

    return getCustomRepository(TaskRepository).allByAuthor(viewer, {
      ids: filters.ids,
      listId: filters.listId === 'inbox' ? null : filters.listId
    })
  }

  /**
   * Creates a task for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async create(
    viewer: Viewer,
    { insertAt, ...attrs }: { insertAt?: number, content?: string; completedAt?: Date | string | null; isCompleted?: boolean; listId?: UUID | null }
  ): Promise<Task> {
    if (!viewer) {
      throw new Unauthorized(`Must be logged in create tasks.`)
    }

    // @todo real validation
    if (typeof attrs.content !== 'string') {
      throw new BadRequest(`Must provide a value for "content".`)
    }

    // validate that the viewer can edit the list they are trying to add a task to
    if (attrs.listId) {
      const list = await ListModel.fetch(viewer, attrs.listId)
      if (!list || !canEditList(viewer, list)) {
        throw new Forbidden(`You don't have access to add tasks to the list with id "${attrs.listId}".`)
      }
    }

    const task = await getCustomRepository(TaskRepository).apply(new Task(), {
      ...attrs,
      createdBy: viewer
    })

    analytics.track({
      event: 'Task Created',
      userId: viewer,
      properties: {
        listId: attrs.listId,
        taskId: task.id
      }
    })

    if (!insertAt) {
      return task
    }

    return TaskModel.moveTask(viewer, {
      id: task.id!,
      listId: attrs.listId || 'inbox',
      insertBefore: insertAt + 1
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

    return getCustomRepository(TaskRepository).apply(task, attrs).then(t => {
      analytics.track({
        event: 'Task Updated',
        userId: viewer,
        properties: {
          listId: t.listId,
          taskId: t.id
        }
      })

      return t
    })
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

    analytics.track({
      event: 'Task Deleted',
      userId: viewer,
      properties: {
        listId: task.listId,
        taskId: task.id
      }
    })
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

    const fromIndex = tasks.indexOf(task)

    // Reorder the tasks and update their `sortOrder`
    let newSortedTasks = move(tasks, fromIndex, args.insertBefore - 1)
    newSortedTasks = assignItemOrderByPositions(newSortedTasks)

    await getCustomRepository(TaskRepository).save(newSortedTasks)

    return task
  }
}

/**
 * Sets each Task's `sortOrder` based on its sorted index (shifted to a 1-based index)
 */
function assignItemOrderByPositions(tasks) {
  return tasks.map((task, index) => {
    task.sortOrder = index + 1
    return task
  })
}
