import { Analytics } from '../lib/analytics'

export type Difference<T, K> = Omit<T, keyof K>

export type Maybe<T> = T | null

declare global {
  interface Window {
    analytics?: Analytics
  }
}
