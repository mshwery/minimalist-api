/**
 * @overview list route handlers
 */

import { NotFound, Forbidden } from 'http-errors'
import { getCustomRepository } from 'typeorm'
import { List, ListRepository } from '../models/list'

async function getAuthorizedList(id: string, viewerId: string): Promise<List> {
  const repo = getCustomRepository(ListRepository)
  const list = await repo.findOne({ id })

  if (!list) {
    throw new NotFound(`No list found with id: '${id}'`)
  }

  if (list.createdBy !== viewerId) {
    throw new Forbidden(`You don't have access to the list with id: '${id}'`)
  }

  return list
}

export async function getLists(req, res, next) {
  try {
    const viewerId = req.user.sub
    const repo = getCustomRepository(ListRepository)
    const lists = await repo.allByAuthor(viewerId)
    res.status(200).json(lists)
  } catch (error) {
    next(error)
  }
}

export async function getList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const list = await getAuthorizedList(id, viewerId)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function createList(req, res, next) {
  try {
    const repo = getCustomRepository(ListRepository)

    let list = repo.create({
      name: req.body.name,
      createdBy: req.user.sub
    })

    list = await repo.save(list)
    res.status(201).json(list)
  } catch (error) {
    next(error)
  }
}

export async function updateList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(ListRepository)
    const list = await getAuthorizedList(id, viewerId)

    // TODO support updating more props?
    await repo.changeName(list, req.body.name)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function deleteList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(ListRepository)
    const list = await getAuthorizedList(id, viewerId)

    await repo.delete(list)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function archiveList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(ListRepository)
    const list = await getAuthorizedList(id, viewerId)

    await repo.archive(list)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function unarchiveList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const repo = getCustomRepository(ListRepository)
    const list = await getAuthorizedList(id, viewerId)

    await repo.unarchive(list)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
