import { EntityRepository, Repository } from 'typeorm'
import List from './list.entity'

@EntityRepository(List)
export default class ListRepository extends Repository<List> {
  /**
   * Get all lists created by the given user id
   * TODO: pagination?
   * TODO: filters?
   */
  public async allByAuthor(authorId: string, ids?: string[]): Promise<List[]> {
    let query = this.createQueryBuilder('list').where({ createdBy: authorId })

    if (ids && ids.length > 0) {
      const dedupedIds = Array.from(new Set(ids))
      query = query.andWhereInIds(dedupedIds)
    }

    return query.orderBy({ 'list."createdAt"': 'DESC' }).getMany()
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
