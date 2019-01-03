import { EntityRepository, Repository } from 'typeorm'
import Task from './task.entity'

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  /**
   * Get all tasks, by author
   * TODO: pagination?
   * TODO: filters?
   */
  public allByAuthor(author: string): Promise<Task[]> {
    return this.find({ createdBy: author })
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
