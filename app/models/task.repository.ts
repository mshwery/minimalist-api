import { EntityRepository, Repository, IsNull, Not } from 'typeorm'
import { Task } from './task.entity'

interface ITaskFilter {
  createdBy: string
  isCompleted?: boolean
}

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks without a list, by author
   * TODO: support other `where` filters?
   * TODO: support pagination?
   */
  public allUngrouped(createdBy: string): Promise<Task[]> {
    return this.find({ createdBy, listId: IsNull() })
  }

  /**
   * Get all completed tasks
   */
  public allByAuthor(conditions: ITaskFilter): Promise<Task[]> {
    return this.find({
      ...conditions,
      completedAt: conditions.isCompleted ? Not(IsNull()) : IsNull()
    })
  }
}
