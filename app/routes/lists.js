/**
 * @overview list route handlers
 */

const { NotFoundError } = require('../utils/errors')
const { List } = require('../database')

function listNotFound (listId) {
  return NotFoundError(`No list found with id: '${listId}'`)
}

async function getLists (req, res) {
  const lists = await List.all()
  res.status(200).json(lists)
}

async function getList (req, res) {
  const id = req.params.listId
  const list = await List.get(id)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}

async function createList (req, res) {
  // @todo validate input params
  const list = await List.create(req.body)
  res.status(201).json(list)
}

async function updateList (req, res) {
  // @todo validate input params
  const id = req.params.listId
  const list = await List.update(id, req.body)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}

async function patchList (req, res) {
  // @todo validate input params
  // @todo implement patch
  const id = req.params.listId
  const list = await List.update(id, req.body)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}

async function deleteList (req, res) {
  const id = req.params.listId
  const list = await List.destroy(id)

  if (list) {
    res.status(204).send(list)
  } else {
    throw listNotFound(id)
  }
}

module.exports = {
  getLists,
  getList,
  createList,
  updateList,
  patchList,
  deleteList
}
