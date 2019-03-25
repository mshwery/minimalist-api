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
import { validate as validateEntity, Length, IsEmail, IsDate } from 'class-validator'
import { hashPassword } from '../../lib/auth'
import { UUID } from '../../types'
import ValidationError from '../ValidationError'
// import List from '../list/list.entity'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id?: UUID

  @Column({ type: 'text', unique: true })
  @Index()
  @IsEmail()
  email: string

  @Column({ type: 'text' })
  @Length(8, 20)
  password: string

  // @ManyToMany(_type => List, list => list.users, { onDelete: 'CASCADE' })
  // @JoinTable({ name: 'user_lists' })
  // lists?: List[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
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

  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    const errors = await validateEntity(this, { skipMissingProperties: true })
    if (errors.length > 0) {
      throw new ValidationError(`Invalid data. Check "errors" for more details.`, errors)
    }
  }
}
