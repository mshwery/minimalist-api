import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  AfterLoad,
  BeforeUpdate,
  BeforeInsert
} from 'typeorm'
import { hashPassword } from '../../lib/auth'
// import List from '../list/list.entity'

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ type: 'text', unique: true })
  @Index()
  email: string

  @Column({ type: 'text' })
  password: string

  // @ManyToMany(_type => List, list => list.users, { onDelete: 'CASCADE' })
  // @JoinTable({ name: 'user_lists' })
  // lists?: List[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date

  private tempPassword: string

  @AfterLoad()
  setTempPassword(): void {
    this.tempPassword = this.password
  }

  @BeforeInsert()
  async hashPasswordOnInsert(): Promise<void> {
    this.password = await hashPassword(this.password)
  }

  @BeforeUpdate()
  async hashPasswordChanges(): Promise<void> {
    // if the password has changed, we need to hash it again
    if (this.tempPassword !== this.password) {
      this.password = await hashPassword(this.password)
    }
  }
}
