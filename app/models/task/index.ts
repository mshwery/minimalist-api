import { getCustomRepository } from 'typeorm'
import { Viewer } from '../../types'
import { List } from '../list'
import Task from './task.entity'
import TaskRepository from './task.repository'

function canViewList(viewer: Viewer, list?: List): boolean {
  // It's possible that when given a `task.list` there is no associated List, so we need to account for that here
  if (!viewer || !list) {
    return false
  }

  if (list.createdBy === viewer) {
    return true
  }

  return false
}

function canViewTask(viewer: Viewer, task: Task): boolean {
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

class TaskModel {
  static async fetch(viewer: Viewer, id: string): Promise<Task | null> {
    if (!viewer) {
      return null
    }

    // load the task, and it's associated list (we have to see if the viewer has access to the list or the task)
    const task = await getCustomRepository(TaskRepository).findOne(id, { relations: ['list'] })
    return task && canViewTask(viewer, task) ? task : null
  }
}

export { Task, TaskModel, TaskRepository }
