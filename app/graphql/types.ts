import { Viewer } from '../types'

export interface Context {
  viewer: Viewer
}

export interface MutationInput<T> {
  input: T
}
