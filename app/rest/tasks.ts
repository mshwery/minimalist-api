/**
 * @overview task route handlers
 */

import { NotFound, Forbidden } from 'http-errors'
import { pick } from 'lodash'
import { getCustomRepository, getRepository } from 'typeorm'
import { Task, TaskModel, TaskRepository } from '../models/task'
import { List } from '../models/list'
import { Viewer } from '../types'

function isListAuthor(list: List | undefined, viewerId: string): boolean {
  if (!list) {
    return false
  }

  return list.createdBy === viewerId
}

async function getAuthorizedTask(id, viewer: Viewer): Promise<Task> {
  const task = await TaskModel.fetch(viewer, id)

  if (!task) {
    throw new NotFound(`No task found with id: '${id}'`)
  }

  return task
}

export async function getTasks(req, res, next) {
  try {
    const viewerId = req.user.sub
    const tasks = await getCustomRepository(TaskRepository).allByAuthor({ createdBy: viewerId })

    res.status(200).json(tasks)
  } catch (error) {
    next(error)
  }
}

export async function getTask(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const task = await getAuthorizedTask(id, viewerId)

    res.status(200).json(task)
  } catch (error) {
    next(error)
  }
}

export async function createTask(req, res, next) {
  try {
    const viewerId = req.user.sub
    const repo = getCustomRepository(TaskRepository)
    const attrs: Partial<Task> = pick(req.body, ['content', 'completedAt', 'isComplete', 'listId'])

    // validate listId if provided
    if ('listId' in attrs) {
      const list = await getRepository(List).findOne({ id: attrs.listId })

      if (!isListAuthor(list, viewerId)) {
        throw new Forbidden(`You don't have access to add items to that list.`)
      }
    }

    const task = repo.create({
      ...attrs,
      createdBy: viewerId
    })

    await repo.save(task)

    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
}

export async function updateTask(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(TaskRepository)
    const task = await getAuthorizedTask(id, viewerId)

    // TODO strong types for `req.body` and validate/sanitize inputs
    const attrs: Partial<Task> = pick(req.body, ['content', 'completedAt', 'isComplete'])
    await repo.apply(task, attrs)

    res.status(200).json(task)
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(TaskRepository)
    const task = await getAuthorizedTask(id, viewerId)

    // delete it!
    await repo.delete(task)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function markComplete(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(TaskRepository)
    const task = await getAuthorizedTask(id, viewerId)

    await repo.markComplete(task)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function markIncomplete(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(TaskRepository)
    const task = await getAuthorizedTask(id, viewerId)

    await repo.markIncomplete(task)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
