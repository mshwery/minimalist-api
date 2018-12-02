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
   * TODO: pagination?
   * TODO: filters?
   */
  public allUngrouped(createdBy: string): Promise<Task[]> {
    return this.find({ createdBy, listId: IsNull() })
  }

  /**
   * Get all completed tasks, by author
   * TODO: pagination?
   * TODO: filters?
   */
  public allByAuthor(conditions: ITaskFilter): Promise<Task[]> {
    return this.find({
      ...conditions,
      completedAt: conditions.isCompleted ? Not(IsNull()) : IsNull()
    })
  }

  public apply(task: Task, changes: Partial<Task>): Promise<Task> {
    task = this.merge(task, changes)
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
