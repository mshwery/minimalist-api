import { EntityRepository, Repository } from 'typeorm'
import List from './list.entity'
import { UUID } from '../../types'
import { ListStatus } from '../../graphql/types'

@EntityRepository(List)
export default class ListRepository extends Repository<List> {
  /**
   * Get all lists created by the given user id
   * TODO: pagination?
   */
  public async allByAuthor(authorId: UUID, { ids, status }: { ids?: UUID[], status?: string } = {}): Promise<List[]> {
    let query = this.createQueryBuilder('list').where({ createdBy: authorId })

    if (ids && ids.length > 0) {
      const dedupedIds = Array.from(new Set(ids))
      query = query.andWhereInIds(dedupedIds)
    }

    if (status === ListStatus.ACTIVE) {
      query = query.andWhere('list."archivedAt" is null')
    } else if (status === ListStatus.ARCHIVED) {
      query = query.andWhere('list."archivedAt" is not null')
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
