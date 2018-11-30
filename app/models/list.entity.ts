import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne
  // ManyToMany
} from 'typeorm'
import { Task } from './task.entity'
import { User } from './user.entity'

@Entity('list')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column('text')
  name: string

  @OneToMany(_type => Task, task => task.list)
  tasks?: Task[]

  // @ManyToMany(_type => User, user => user.lists, { onDelete: 'CASCADE' })
  // users?: User[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt?: Date

  @Column('uuid')
  createdBy?: string

  @ManyToOne(_type => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  creator?: User

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  archivedAt?: Date | null

  // Convenient getter to alias `archivedAt` as a boolean
  get isArchived(): boolean {
    return Boolean(this.archivedAt)
  }

  // Sets the `archivedAt` timestamp when set to `true`
  set isArchived(value: boolean) {
    if (value === true) {
      this.archivedAt = new Date()
    } else {
      this.archivedAt = null
    }
  }
}
