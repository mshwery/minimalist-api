import { EntityRepository, Repository } from 'typeorm'
import { List } from './list.entity'

@EntityRepository(List)
export class ListRepository extends Repository<List> {
  /**
   * Get all lists by createdBy
   * TODO: support other `where` filters
   * TODO: support pagination
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

  /**
   * Get a list by id and createdBy
   */
  public getByIdAndCreatedBy(id: string, createdBy: string): Promise<List | undefined> {
    return this.findOne({ id, createdBy })
  }
}
