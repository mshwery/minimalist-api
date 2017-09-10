/**
 * @overview task route handlers
 */

const { NotFoundError } = require('../utils/errors')
const { Task } = require('../database')

async function getTasks (req, res) {
  const lists = await Task.all()
  res.status(200).json(lists)
}

async function getTask (req, res) {
  const id = req.params.taskId
  const list = await Task.find({ id })

  if (list) {
    res.status(200).json(list)
  } else {
    throw NotFoundError(`No list found with id: '${id}'`)
  }
}

async function createTask (req, res) {

}

async function updateTask (req, res) {

}

async function patchTask (req, res) {

}

async function deleteTask (req, res) {

}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask
}
