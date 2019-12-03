import { EntityRepository, Repository } from 'typeorm'
import Task from './task.entity'
import { UUID } from '../../types'

interface TaskFilters {
  ids?: UUID[]
  listId?: UUID | null
}

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks for the given user id
   * TODO: pagination?
   */
  public allByAuthor(viewer: UUID, filters: TaskFilters = {}): Promise<Task[]> {
    const attrs: Partial<Task> = {
      createdBy: viewer
    }

    if (filters.listId !== undefined) {
      attrs.listId = filters.listId
    }

    let query = this.createQueryBuilder('task').where(attrs)

    if (filters.ids && filters.ids.length > 0) {
      const dedupedIds = Array.from(new Set(filters.ids))
      query = query.andWhereInIds(dedupedIds)
    }

    return query.getMany()
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
