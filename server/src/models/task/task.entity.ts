import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { validate as validateEntity, IsDate, ValidateNested, IsUUID, IsDefined } from 'class-validator'
import List from '../list/list.entity'
import User from '../user/user.entity'
import { DateLike, UUID } from '../../types'
import ValidationError from '../ValidationError'

@Entity('tasks', {
  orderBy: {
    sortOrder: { order: 'ASC', nulls: 'NULLS LAST' },
    createdAt: 'ASC',
  },
})
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('text')
  @IsDefined()
  content: string

  @Column({ nullable: true })
  listId?: UUID | null

  @ManyToOne((_type) => List, (list) => list.tasks, { nullable: true, primary: true, onDelete: 'CASCADE' })
  @ValidateNested()
  list?: List

  @Column('integer', { nullable: true })
  sortOrder?: number | null

  @Column('timestamp with time zone', { nullable: true })
  @IsDate()
  completedAt?: DateLike | null

  @Column('timestamp with time zone', { nullable: true })
  @IsDate()
  due?: DateLike | null

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  createdAt?: Date

  @Column('uuid')
  @IsUUID()
  @IsDefined()
  createdBy: UUID

  // @todo test what happens when we delete a user after they've created a list...
  @ManyToOne((_type) => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  @ValidateNested()
  creator?: User

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updatedAt?: Date

  // Convenient getter to alias `completedAt` as a boolean
  get isCompleted(): boolean {
    return Boolean(this.completedAt)
  }

  // Sets the `completedAt` timestamp when set to `true`
  set isCompleted(value: boolean) {
    if (value === true) {
      // only update the timestamp if it previously was not complete
      this.completedAt = this.completedAt || new Date()
    } else {
      this.completedAt = null
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
