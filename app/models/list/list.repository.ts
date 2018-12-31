import { EntityRepository, Repository } from 'typeorm'
import List from './list.entity'
import { Viewer } from '../../types'

@EntityRepository(List)
export default class ListRepository extends Repository<List> {
  /**
   * Gets a single list if the viewer created it
   * TODO: separate authz from query building (biz logic vs entity/repository)
   */
  public async fetch(viewer: Viewer, id: string): Promise<List | null> {
    if (!viewer) {
      return null
    }

    const list = await this.findOne({ id })
    if (!list || list.createdBy !== viewer) {
      return null
    }

    return list
  }

  /**
   * Get all lists created by the given user id
   * TODO: separate authz from query building (biz logic vs entity/repository)
   * TODO: pagination?
   * TODO: filters?
   */
  public async allByAuthor(viewer: Viewer, ids?: string[]): Promise<List[]> {
    if (!viewer) {
      return []
    }

    let query = this.createQueryBuilder('list').where({ createdBy: viewer })

    if (ids && ids.length > 0) {
      const dedupedIds = Array.from(new Set(ids))
      query = query.andWhereInIds(dedupedIds)
    }

    return query.orderBy({ 'list."createdAt"': 'DESC' }).getMany()
  }

  public async changeName(list: List, newName: string): Promise<List> {
    list.name = newName
    return this.save(list)
  }

  public async archive(list: List): Promise<List> {
    list.isArchived = true
    return this.save(list)
  }

  public async unarchive(list: List): Promise<List> {
    list.isArchived = false
    return this.save(list)
  }
}
