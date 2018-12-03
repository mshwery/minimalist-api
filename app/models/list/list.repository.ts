import { EntityRepository, Repository } from 'typeorm'
import { List } from './list.entity'

@EntityRepository(List)
export class ListRepository extends Repository<List> {
  /**
   * Get all lists created by the given user id
   * TODO: pagination?
   * TODO: filters?
   */
  public allByAuthor(createdBy: string): Promise<List[]> {
    return this.find({
      where: {
        createdBy
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }

  public changeName(list: List, newName: string): Promise<List> {
    list.name = newName
    return this.save(list)
  }

  public archive(list: List): Promise<List> {
    list.isArchived = true
    return this.save(list)
  }

  public unarchive(list: List): Promise<List> {
    list.isArchived = false
    return this.save(list)
  }
}
