import { EntityRepository, Repository, getCustomRepository, Brackets } from 'typeorm'
import List from './list.entity'
import { Viewer } from '../../types'
import { ListStatus } from '../../graphql/types'
import { UserRepository } from '../user'

@EntityRepository(List)
export default class ListRepository extends Repository<List> {
  public async findWithTasks(id: string): Promise<List | undefined> {
    /**
     * had to sort manually because `relations` doesn't respect the default entity sort
     * @see {@link https://github.com/typeorm/typeorm/issues/2620}
     */
    return this.createQueryBuilder('list')
      .select('list')
      .leftJoinAndSelect('list.tasks', 'task')
      .leftJoinAndSelect('list.users', 'user')
      .where('list.id = :id', { id })
      .orderBy({
        'task.sortOrder': { order: 'ASC', nulls: 'NULLS LAST' },
        'task.createdAt': 'ASC'
      })
      .getOne()
  }

  /**
   * Get all lists for given user id
   * TODO: pagination?
   */
  public async allByViewer(viewer: Viewer, { status }: { status?: string } = {}): Promise<List[]> {
    let query = this.createQueryBuilder('list')
      .leftJoin('list.users', 'user', 'user.id = :viewer', { viewer })
      .where(
        new Brackets(qb => {
          qb.where('list.createdBy = :viewer', { viewer }).orWhere('user.id = :viewer', { viewer })
        })
      )

    if (status === ListStatus.ACTIVE) {
      query = query.andWhere('list."archivedAt" is null')
    } else if (status === ListStatus.ARCHIVED) {
      query = query.andWhere('list."archivedAt" is not null')
    }

    return query.orderBy({ 'list."createdAt"': 'ASC' }).getMany()
  }

  public async archive(list: List): Promise<List> {
    list.isArchived = true
    return this.save(list)
  }

  public async unarchive(list: List): Promise<List> {
    list.isArchived = false
    return this.save(list)
  }

  public async addUserToList(email: string, listId: string): Promise<boolean> {
    const list = await this.findOneOrFail(listId, { relations: ['users'] })
    const user = await getCustomRepository(UserRepository).findOrCreate({ email })

    // already has access!
    if (list.users.find(u => u.id === user.id)) {
      return false
    }

    list.users.push(user)

    await this.save(list)
    return true
  }

  public async removeUserFromList(userId: string, listId: string): Promise<List> {
    const list = await this.findOneOrFail(listId, { relations: ['users'] })
    list.users = list.users.filter(u => u.id !== userId)
    return this.save(list)
  }
}
