import { getCustomRepository } from 'typeorm'
import { Viewer } from '../../types'
import { canViewList } from '../list'
import Task from './task.entity'
import TaskRepository from './task.repository'

export { Task, TaskRepository }

export function canViewTask(viewer: Viewer, task: Task): boolean {
  if (!viewer) {
    return false
  }

  if (task.createdBy === viewer) {
    return true
  }

  if (canViewList(viewer, task.list)) {
    return true
  }

  return false
}

export class TaskModel {
  /**
   * Gets a task if the viewer has access to it
   */
  static async fetch(viewer: Viewer, id: string): Promise<Task | null> {
    if (!viewer) {
      return null
    }

    // load the task, and it's associated list (we have to see if the viewer has access to the list or the task)
    const task = await getCustomRepository(TaskRepository).findOne(id, { relations: ['list'] })
    if (!task) {
      return null
    }

    return canViewTask(viewer, task) ? task : null
  }
}
