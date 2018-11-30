/**
 * @overview task route handlers
 */

const { NotFound } = require('http-errors')
const { Task } = require('../database')
const withValidation = require('../middleware/validation')
const schema = require('../schema/task')

function taskNotFound (id) {
  return new NotFound(`No task found with id: '${id}'`)
}

exports.getTasks = async function getTasks (req, res) {
  const tasks = await Task.all(req.query, req.user.sub)
  res.status(200).json(tasks)
}

exports.getTask = async function getTask (req, res) {
  const id = req.params.id
  const task = await Task.get(id, req.user.sub)

  if (task) {
    res.status(200).json(task)
  } else {
    throw taskNotFound(id)
  }
}

exports.createTask = withValidation({ body: schema },
  async function createTask (req, res) {
    const task = await Task.create(req.body, req.user.sub)
    res.status(201).json(task)
  }
)

exports.updateTask = withValidation({ body: schema },
  async function updateTask (req, res) {
    const id = req.params.id
    const task = await Task.update(id, req.body, req.user.sub)

    if (task) {
      res.status(200).json(task)
    } else {
      throw taskNotFound(id)
    }
  }
)

// @todo implement patch
exports.patchTask = withValidation({ body: schema },
  async function patchTask (req, res) {
    const id = req.params.id
    const task = await Task.update(id, req.body, req.user.sub)

    if (task) {
      res.status(200).json(task)
    } else {
      throw taskNotFound(id)
    }
  }
)

exports.deleteTask = async function deleteTask (req, res) {
  const id = req.params.id
  const task = await Task.destroy(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

exports.closeTask = async function closeTask (req, res) {
  const id = req.params.id
  const task = await Task.close(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}

exports.reopenTask = async function reopenTask (req, res) {
  const id = req.params.id
  const task = await Task.reopen(id, req.user.sub)

  if (task) {
    res.status(204).end()
  } else {
    throw taskNotFound(id)
  }
}
