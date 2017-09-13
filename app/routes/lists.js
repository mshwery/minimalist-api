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

// @todo validate input params
async function createList (req, res) {
  const list = await List.create(req.body)
  res.status(201).json(list)
}

// @todo validate input params
async function updateList (req, res) {
  const id = req.params.listId
  const list = await List.update(id, req.body)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}

// @todo validate input params
// @todo implement patch
async function patchList (req, res) {
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
    res.status(204).end()
  } else {
    throw listNotFound(id)
  }
}

async function archiveList (req, res) {
  const id = req.params.listId
  const list = await List.archive(id)

  if (list) {
    res.status(200).json(list)
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
  deleteList,
  archiveList
}
