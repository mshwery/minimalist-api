import { EntityRepository, Repository, Not, IsNull, FindManyOptions, LessThanOrEqual, FindConditions } from 'typeorm'
import Task from './task.entity'
import { UUID, DateLike } from '../../types'
import { TaskStatus } from '../../graphql/types'

interface TaskFilters {
  listId?: UUID | null
  status?: TaskStatus
  dueBy?: DateLike
}

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks for the given user id
   * TODO: pagination?
   */
  public allByAuthor(viewer: UUID, filters: TaskFilters = {}): Promise<Task[]> {
    const attrs: FindConditions<Task> = {
      createdBy: viewer,
    }

    const options: FindManyOptions<Task> = {}

    if (filters.listId !== undefined) {
      attrs.listId = filters.listId
    }

    if (filters.status === TaskStatus.DONE) {
      attrs.completedAt = Not(IsNull())
    }

    if (filters.status === TaskStatus.REMAINING) {
      attrs.completedAt = IsNull()
    }

    if (filters.dueBy) {
      attrs.due = LessThanOrEqual(filters.dueBy)
      options.order = {
        due: 'ASC',
        sortOrder: 'ASC',
      }
    }

    return this.find({ where: attrs, ...options })
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

  public schedule(task: Task, due: DateLike | null): Promise<Task> {
    task.due = due
    return this.save(task)
  }
}
