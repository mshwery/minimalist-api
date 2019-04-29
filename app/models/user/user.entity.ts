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

  // Password is nullable because you can sign up w/ social (Google) instead
  @Column({ type: 'text', nullable: true })
  @Length(8, 20)
  password: string | null

  // @ManyToMany(_type => List, list => list.users, { onDelete: 'CASCADE' })
  // @JoinTable({ name: 'user_lists' })
  // lists?: List[]

  @Column({ type: 'text', nullable: true })
  image?: string

  @Column({ type: 'text', nullable: true })
  name?: string

  @Column({ type: 'text', nullable: true })
  googleId?: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updatedAt?: Date

  private tempPassword: string | null

  @AfterLoad()
  setTempPassword(): void {
    this.tempPassword = this.password
  }

  @BeforeInsert()
  async hashPasswordOnInsert(): Promise<void> {
    if (this.password) {
      this.password = await hashPassword(this.password)
    }
  }

  @BeforeUpdate()
  async hashPasswordChanges(): Promise<void> {
    // if the password has changed, we need to hash it again
    if (this.password && this.tempPassword !== this.password) {
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
