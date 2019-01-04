import { Viewer } from '../types'

export interface IContext {
  viewer: Viewer
}

export interface IMutationInput<T> {
  input: T
}
