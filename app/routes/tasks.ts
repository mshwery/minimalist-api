/**
 * @overview task route handlers
 */

import { NotFound, Forbidden } from 'http-errors'
import { pick } from 'lodash'
import { getCustomRepository, getRepository } from 'typeorm'
import { Task } from '../models/task.entity'
import { List } from '../models/list.entity'
import { TaskRepository } from '../models/task.repository'

function isListAuthor(list: List | undefined, viewerId: string): boolean {
  if (!list) {
    return false
  }

  return list.createdBy === viewerId
}

function isTaskAuthor(task: Task, viewerId): boolean {
  return task.createdBy === viewerId
}

async function getAuthorizedTask(id, viewerId): Promise<Task> {
  const task = await getRepository(Task).findOne(id, { relations: ['list'] })

  if (!task) {
    throw new NotFound(`No task found with id: '${id}'`)
  }

  // If the task *is* associated with a list we have to see if this user has access to the list (created it)
  if (task.list && !isListAuthor(task.list, viewerId)) {
    throw new Forbidden(`You don't have access to this task.`)
  }

  // If the task isn't associated with a list we have to see if this user has access to the task (created it)
  if (!task.list && !isTaskAuthor(task, viewerId)) {
    throw new Forbidden(`You don't have access to this task.`)
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
    const repo = getRepository(Task)
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
    const task = await getAuthorizedTask(id, viewerId)
    const repo = getRepository(Task)

    // TODO strong types for `req.body` and validate/sanitize inputs
    const attrs = pick(req.body, ['content', 'completedAt', 'isComplete'])

    // update the model
    repo.merge(task, attrs)

    // save the changes
    await repo.save(task)

    res.status(200).json(task)
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const task = await getAuthorizedTask(id, viewerId)
    const repo = getRepository(Task)

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
    const task = await getAuthorizedTask(id, viewerId)
    const repo = getRepository(Task)

    // update the model
    task.isCompleted = true

    // save the changes
    await repo.save(task)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function markIncomplete(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const task = await getAuthorizedTask(id, viewerId)
    const repo = getRepository(Task)

    // update the model
    task.isCompleted = false

    // save the changes
    await repo.save(task)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
