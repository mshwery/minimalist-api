/**
 * @overview task route handlers
 */

const { NotFoundError } = require('../utils/errors')
const { Task } = require('../database')

function taskNotFound (taskId) {
  return NotFoundError(`No task found with id: '${taskId}'`)
}

async function getTasks (req, res) {
  const tasks = await Task.all()
  res.status(200).json(tasks)
}

async function getTask (req, res) {
  const id = req.params.taskId
  const task = await Task.get(id)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

// @todo validate input params
async function createTask (req, res) {
  const task = await Task.create(req.body)
  res.status(201).json(task)
}

// @todo validate input params
async function updateTask (req, res) {
  const id = req.params.taskId
  const task = await Task.update(id, req.body)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

// @todo validate input params
// @todo implement patch
async function patchTask (req, res) {
  const id = req.params.taskId
  const task = await Task.update(id, req.body)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

async function deleteTask (req, res) {
  const id = req.params.taskId
  const task = await Task.destroy(id)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

async function closeTask (req, res) {
  const id = req.params.taskId
  const task = await Task.close(id)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

async function reopenTask (req, res) {
  const id = req.params.taskId
  const task = await Task.reopen(id)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  closeTask,
  reopenTask
}
