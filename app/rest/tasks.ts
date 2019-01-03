/**
 * @overview task route handlers
 */

import { NotFound } from 'http-errors'
import { pick } from 'lodash'
import { Task, TaskModel } from '../models/task'
import { Viewer } from '../types'

async function getAuthorizedTask(id, viewer: Viewer): Promise<Task> {
  const task = await TaskModel.fetch(viewer, id)

  if (!task) {
    throw new NotFound(`No task found with id: '${id}'`)
  }

  return task
}

export async function getTasks(req, res, next) {
  try {
    const viewer = req.user.sub
    const tasks = await TaskModel.fetchAllByViewer(viewer)
    res.status(200).json(tasks)
  } catch (error) {
    next(error)
  }
}

export async function getTask(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    const task = await getAuthorizedTask(id, viewer)

    res.status(200).json(task)
  } catch (error) {
    next(error)
  }
}

export async function createTask(req, res, next) {
  try {
    const viewer = req.user.sub
    const attrs: Partial<Task> = pick(req.body, ['content', 'completedAt', 'isComplete', 'listId'])
    const task = await TaskModel.create(viewer, attrs)
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
}

export async function updateTask(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id

    // TODO strong types for `req.body` and validate/sanitize inputs
    const attrs: Partial<Task> = pick(req.body, ['content', 'completedAt', 'isComplete'])
    const task = await TaskModel.update(viewer, id, attrs)
    res.status(200).json(task)
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    await TaskModel.delete(viewer, id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function markComplete(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    await TaskModel.markComplete(viewer, id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function markIncomplete(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    await TaskModel.markIncomplete(viewer, id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
