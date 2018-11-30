import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  ManyToMany
} from 'typeorm'
import { Task } from './task.entity'
import { User } from './user.entity'

@Entity('list')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column('text')
  name: string

  @OneToMany(type => Task, task => task.list)
  tasks: Task[]

  @ManyToMany(type => User, user => user.lists, { onDelete: 'CASCADE' })
  users: User[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt?: Date

  @ManyToOne(type => User, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  archivedAt?: Date | null
}
