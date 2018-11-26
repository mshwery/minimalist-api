import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { List } from './list.entity'

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column('text')
  content: string

  @ManyToOne(type => List, list => list.tasks, { nullable: true, primary: true, onDelete: 'CASCADE' })
  list: List

  @Column('timestamp with time zone', { nullable: true })
  completedAt?: Date | null

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date

  // Convenient getter to alias `completedAt` as a boolean
  get isCompleted(): boolean {
    return Boolean(this.completedAt)
  }

  // Sets the `completedAt` timestamp when set to `true`
  set isCompleted(value: boolean) {
    if (value === true) {
      this.completedAt = new Date()
    } else {
      this.completedAt = null
    }
  }
}
