import { pick } from 'lodash'
import { EntityRepository, Repository, IsNull, Not, FindConditions } from 'typeorm'
import Task from './task.entity'

interface ITaskFilter {
  createdBy: string
  isCompleted?: boolean
}

function getConditions(attrs: any): FindConditions<Task> {
  const conditions: FindConditions<Task> = pick(attrs, ['id', 'completedAt', 'createdBy', 'listId'])

  if (typeof attrs.isCompleted === 'boolean') {
    conditions.completedAt = attrs.isCompleted ? Not(IsNull()) : IsNull()
  }

  return conditions
}

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks without a list, by author
   * TODO: pagination?
   * TODO: filters?
   */
  public allUngrouped(conditions: ITaskFilter): Promise<Task[]> {
    const where = getConditions({
      ...conditions,
      listId: IsNull()
    })

    return this.find(where)
  }

  /**
   * Get all tasks, by author (and other filters)
   * TODO: pagination?
   * TODO: filters?
   */
  public allByAuthor(conditions: ITaskFilter): Promise<Task[]> {
    const where = getConditions(conditions)
    return this.find(where)
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
