/**
 * @overview list route handlers
 */

const { NotFound } = require('http-errors')
const { List } = require('../database')
const withValidation = require('../middleware/validation')
const schema = require('../schema/list')

function listNotFound (id) {
  return new NotFound(`No list found with id: '${id}'`)
}

exports.getLists = async function getLists (req, res) {
  const lists = await List.all(req.query)
  res.status(200).json(lists)
}

exports.getList = async function getList (req, res) {
  const id = req.params.id
  const list = await List.get(id)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}

exports.createList = withValidation({ body: schema },
  async function createList (req, res) {
    const list = await List.create(req.body)
    res.status(201).json(list)
  }
)

exports.updateList = withValidation({ body: schema },
  async function updateList (req, res) {
    const id = req.params.id
    const list = await List.update(id, req.body)

    if (list) {
      res.status(200).json(list)
    } else {
      throw listNotFound(id)
    }
  }
)

// @todo implement patch
exports.patchList = withValidation({ body: schema },
  async function patchList (req, res) {
    const id = req.params.id
    const list = await List.update(id, req.body)

    if (list) {
      res.status(200).json(list)
    } else {
      throw listNotFound(id)
    }
  }
)

exports.deleteList = async function deleteList (req, res) {
  const id = req.params.id
  const list = await List.destroy(id)

  if (list) {
    res.status(204).end()
  } else {
    throw listNotFound(id)
  }
}

exports.archiveList = async function archiveList (req, res) {
  const id = req.params.id
  const list = await List.archive(id)

  if (list) {
    res.status(200).json(list)
  } else {
    throw listNotFound(id)
  }
}
