export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Difference<T, K> = Omit<T, keyof K>

export type Maybe<T> = T | null
