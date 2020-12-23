import { ValidationError as ModelValidationError } from 'class-validator'

export default class ValidationError extends Error {
  expose: boolean = true
  status: number = 400
  validationErrors: ModelValidationError[]

  constructor(message: string, validationErrors: ModelValidationError[]) {
    super(message)
    this.validationErrors = validationErrors
  }
}
