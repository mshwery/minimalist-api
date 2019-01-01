import { getCustomRepository } from 'typeorm'
import { Viewer } from '../../types'
import List from './list.entity'
import ListRepository from './list.repository'

export { List, ListRepository }

export function canViewList(viewer: Viewer, list?: List): boolean {
  // It's possible that when given a `task.list` there is no associated List, so we need to account for that here
  if (!viewer || !list) {
    return false
  }

  if (list.createdBy === viewer) {
    return true
  }

  return false
}

export class ListModel {
  /**
   * Gets a list if the viewer has access to it
   */
  static async fetch(viewer: Viewer, id: string): Promise<List | null> {
    if (!viewer) {
      return null
    }

    const list = await getCustomRepository(ListRepository).findOne(id)
    if (!list) {
      return null
    }

    return canViewList(viewer, list) ? list : null
  }

  /**
   * Get all lists created by the current viewer
   */
  static async fetchByViewer(viewer: Viewer, ids?: string[]): Promise<List[]> {
    if (!viewer) {
      return []
    }

    return getCustomRepository(ListRepository).allByAuthor(viewer, ids)
  }
}
