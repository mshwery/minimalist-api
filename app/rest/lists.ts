/**
 * @overview list route handlers
 */

import { NotFound } from 'http-errors'
import { List, ListModel } from '../models/list'
import { Viewer } from '../types'

async function getAuthorizedList(id: string, viewer: Viewer): Promise<List> {
  const list = await ListModel.fetch(viewer, id)

  if (!list) {
    throw new NotFound(`No list found with id: '${id}'`)
  }

  return list
}

export async function getLists(req, res, next) {
  try {
    const viewer = req.user.sub
    const lists = await ListModel.fetchAllByViewer(viewer)
    res.status(200).json(lists)
  } catch (error) {
    next(error)
  }
}

export async function getList(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    const list = await getAuthorizedList(id, viewer)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function createList(req, res, next) {
  try {
    const viewer = req.user.sub
    const name = req.body.name
    const list = await ListModel.create(viewer, { name })
    res.status(201).json(list)
  } catch (error) {
    next(error)
  }
}

export async function updateList(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id

    // TODO support updating more props?
    const name = req.body.name

    const list = await ListModel.update(viewer, id, { name })
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function deleteList(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    await ListModel.delete(viewer, id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function archiveList(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    const list = await ListModel.archive(viewer, id)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function unarchiveList(req, res, next) {
  try {
    const viewer = req.user.sub
    const id = req.params.id
    const list = await ListModel.unarchive(viewer, id)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
