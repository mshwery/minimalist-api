import { EntityRepository, Repository } from 'typeorm'
import { List } from './list.entity'

@EntityRepository(List)
export class ListRepository extends Repository<List> {
  /**
   * Get all lists by createdBy
   * TODO: pagination?
   * TODO: filters?
   */
  public allByCreatedBy(createdBy: string): Promise<List[]> {
    return this.find({
      where: {
        // TODO: support joining on user_list
        createdBy
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }
}
