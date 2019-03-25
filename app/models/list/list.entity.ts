import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate
  // ManyToMany
} from 'typeorm'
import { validate as validateEntity, IsDate, Length, ValidateNested, IsUUID } from 'class-validator'
import Task from '../task/task.entity'
import User from '../user/user.entity'
import { UUID } from '../../types'
import ValidationError from '../ValidationError'

@Entity('lists')
export default class List {
  @PrimaryGeneratedColumn('uuid')
  id?: UUID

  @Column('text')
  @Length(1, 21)
  name: string

  @OneToMany(_type => Task, task => task.list)
  @ValidateNested()
  tasks?: Task[]

  // @ManyToMany(_type => User, user => user.lists, { onDelete: 'CASCADE' })
  // users?: User[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  createdAt?: Date

  @Column('uuid')
  @IsUUID()
  createdBy: UUID

  @ManyToOne(_type => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  @ValidateNested()
  creator?: User

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updatedAt?: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
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

  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    const errors = await validateEntity(this, { skipMissingProperties: true })
    if (errors.length > 0) {
      throw new ValidationError(`Invalid data. Check "errors" for more details.`, errors)
    }
  }
}
