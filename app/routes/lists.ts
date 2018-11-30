/**
 * @overview list route handlers
 */

import { NotFound, Forbidden } from 'http-errors'
import { getCustomRepository, getRepository } from 'typeorm'
import { List } from '../models/list.entity'
import { ListRepository } from '../models/list.repository'

async function getAuthorizedList(id: string, viewerId: string): Promise<List> {
  const list = await getRepository(List).findOne({ id })

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
    const lists = await getCustomRepository(ListRepository).allByCreatedBy(viewerId)
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
    const repo = getRepository(List)

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
    let list = await getAuthorizedList(id, viewerId)

    // TODO support updating more props?
    list.name = req.body.name

    list = await getRepository(List).save(list)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function deleteList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const list = await getAuthorizedList(id, viewerId)

    await getRepository(List).delete(list)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function archiveList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const list = await getAuthorizedList(id, viewerId)

    list.isArchived = true

    await getRepository(List).save(list)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export async function unarchiveList(req, res, next) {
  try {
    const id = req.params.id
    const viewerId = req.user.sub
    const list = await getAuthorizedList(id, viewerId)

    list.isArchived = false

    await getRepository(List).save(list)
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
