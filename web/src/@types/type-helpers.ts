import { Analytics } from '../lib/analytics'

export type Maybe<T> = T | null

export type QueryResult<Data> = Data & {
  error: unknown
  isLoading: boolean
}

declare global {
  interface Window {
    analytics?: Analytics
  }
}
