import { ValidationError } from 'class-validator'

export type Viewer = string | undefined

export type DateLike = Date | string

// @todo real uuid type?
export type UUID = string

export interface IValidationErrors {
  message: string
  expose?: boolean
  errors?: ValidationError[]
}
