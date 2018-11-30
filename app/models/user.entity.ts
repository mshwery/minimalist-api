import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { List } from './list.entity'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  @Index()
  email: string

  @Column({ type: 'text' })
  password: string

  @ManyToMany(type => List, list => list.users, { onDelete: 'CASCADE' })
  @JoinTable()
  lists: List[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
