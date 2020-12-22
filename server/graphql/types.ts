import { Viewer } from '../types'

export interface Context {
  viewer: Viewer
}

export interface MutationInput<T> {
  input: T
}

export enum ListStatus {
  ARCHIVED = 'ARCHIVED',
  ACTIVE = 'ACTIVE',
  ALL = 'ALL',
}

export enum TaskStatus {
  DONE = 'DONE',
  REMAINING = 'REMAINING',
  ALL = 'ALL',
}
