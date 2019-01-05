import { EntityRepository, Repository } from 'typeorm'
import Task from './task.entity'
import { UUID } from '../../types'

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks created by the given user id
   * TODO: pagination?
   * TODO: filters?
   */
  public allByAuthor(author: UUID, ids?: UUID[]): Promise<Task[]> {
    let query = this.createQueryBuilder('task').where({ createdBy: author })

    if (ids && ids.length > 0) {
      const dedupedIds = Array.from(new Set(ids))
      query = query.andWhereInIds(dedupedIds)
    }

    return query.orderBy({ 'task."createdAt"': 'DESC' }).getMany()
  }

  public apply(task: Task, changes: Partial<Task>): Promise<Task> {
    task = this.merge(task, changes)

    // we have to manually do this one
    if (typeof changes.isCompleted === 'boolean') {
      task.isCompleted = changes.isCompleted
    }

    return this.save(task)
  }

  public markComplete(task: Task): Promise<Task> {
    task.isCompleted = true
    return this.save(task)
  }

  public markIncomplete(task: Task): Promise<Task> {
    task.isCompleted = false
    return this.save(task)
  }
}
