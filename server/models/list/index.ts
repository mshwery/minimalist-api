import { Forbidden, NotFound, Unauthorized } from 'http-errors'
import { get } from 'lodash'
import { getCustomRepository, FindOneOptions } from 'typeorm'
import analytics from '../../lib/analytics'
import { Viewer, UUID } from '../../types'
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
  static async fetch(viewer: Viewer, id: UUID, options?: { withTasks?: boolean }): Promise<List | null> {
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
  static async fetchAllByViewer(viewer: Viewer, ids?: UUID[]): Promise<List[]> {
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

    const newList = await repo.save(list)

    analytics.track({
      event: 'List Created',
      userId: viewer,
      properties: {
        listId: newList.id,
        createdBy: viewer
      }
    })

    return newList
  }

  /**
   * Updates a list for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async update(viewer: Viewer, id: UUID, attrs: Partial<List>): Promise<List> {
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
  static async archive(viewer: Viewer, id: UUID): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository).archive(list).then(l => {
      analytics.track({
        event: 'List Archived',
        userId: viewer,
        properties: {
          listId: l.id
        }
      })

      return l
    })
  }

  /**
   * Unarchives a list for the viewer
   */
  static async unarchive(viewer: Viewer, id: UUID): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository).unarchive(list).then(l => {
      analytics.track({
        event: 'List Unarchived',
        userId: viewer,
        properties: {
          listId: l.id
        }
      })

      return l
    })
  }

  /**
   * Deletes a list if the viewer has access
   */
  static async delete(viewer: Viewer, id: UUID): Promise<void> {
    const list = await ListModel.fetch(viewer, id)

    // viewer can only delete their own lists
    if (!list || !canEditList(viewer, list)) {
      throw new Forbidden(`Cannot delete lists that you don't have access to.`)
    }

    await getCustomRepository(ListRepository).delete(id)

    analytics.track({
      event: 'List Deleted',
      userId: viewer,
      properties: {
        listId: list.id
      }
    })
  }
}
