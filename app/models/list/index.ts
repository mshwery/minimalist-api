import { Forbidden, NotFound, Unauthorized } from 'http-errors'
import { get } from 'lodash'
import { getCustomRepository, FindOneOptions } from 'typeorm'
import { Viewer } from '../../types'
import List from './list.entity'
import ListRepository from './list.repository'

export { List, ListRepository }

export function canViewList(viewer: Viewer, list: List): boolean {
  // It's possible that when given a `task.list` there is no associated List, so we need to account for that here
  if (!viewer) {
    return false
  }

  if (list.createdBy === viewer) {
    return true
  }

  return false
}

export function canEditList(viewer: Viewer, list: List): boolean {
  // for now we'll the same users who can view a list can edit it
  return canViewList(viewer, list)
}

export class ListModel {
  /**
   * Gets a list if the viewer has access to it
   */
  static async fetch(viewer: Viewer, id: string, options?: { withTasks?: boolean }): Promise<List | null> {
    if (!viewer) {
      return null
    }

    const findOptions: FindOneOptions = {}
    if (get(options, 'withTasks')) {
      findOptions.relations = ['tasks']
    }

    const list = await getCustomRepository(ListRepository).findOne(id, findOptions)
    if (!list) {
      return null
    }

    return canViewList(viewer, list) ? list : null
  }

  /**
   * Get all lists created by the viewer
   */
  static async fetchAllByViewer(viewer: Viewer, ids?: string[]): Promise<List[]> {
    if (!viewer) {
      return []
    }

    return getCustomRepository(ListRepository).allByAuthor(viewer, ids)
  }

  /**
   * Creates a list for the viewer given some attributes
   * @todo validate `attrs.name`
   */
  static async create(viewer: Viewer, attrs: { name: string }): Promise<List> {
    if (!viewer) {
      throw new Unauthorized(`Must be logged in create lists.`)
    }

    const repo = getCustomRepository(ListRepository)
    const list = repo.create({
      name: attrs.name,
      createdBy: viewer
    })

    return repo.save(list)
  }

  /**
   * Updates a list for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async update(viewer: Viewer, id: string, attrs: Partial<List>): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    const repo = getCustomRepository(ListRepository)
    repo.merge(list, attrs)

    return repo.save(list)
  }

  /**
   * Archives a list for the viewer
   */
  static async archive(viewer: Viewer, id: string): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository).archive(list)
  }

  /**
   * Unarchives a list for the viewer
   */
  static async unarchive(viewer: Viewer, id: string): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository).unarchive(list)
  }

  /**
   * Deletes a list if the viewer has access
   */
  static async delete(viewer: Viewer, id: string): Promise<void> {
    const list = await ListModel.fetch(viewer, id)

    // viewer can only delete their own lists
    if (!list || !canEditList(viewer, list)) {
      throw new Forbidden(`Cannot delete lists that you don't have access to.`)
    }

    await getCustomRepository(ListRepository).delete(id)
  }
}
