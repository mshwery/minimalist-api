/**
 * @overview task route handlers
 */

import { NotFound } from 'http-errors'

function taskNotFound(id) {
  return new NotFound(`No task found with id: '${id}'`)
}

export async function getTasks(req, res) {
  const tasks = await Task.all(req.query, req.user.sub)
  res.status(200).json(tasks)
}

export async function getTask(req, res) {
  const id = req.params.id
  const task = await Task.get(id, req.user.sub)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

export async function createTask(req, res) {
  const task = await Task.create(req.body, req.user.sub)
  res.status(201).json(task)
}

export async function updateTask(req, res) {
  const id = req.params.id
  const task = await Task.update(id, req.body, req.user.sub)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

export async function deleteTask(req, res) {
  const id = req.params.id
  const task = await Task.destroy(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

export async function closeTask(req, res) {
  const id = req.params.id
  const task = await Task.close(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

export async function reopenTask(req, res) {
  const id = req.params.id
  const task = await Task.reopen(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}
