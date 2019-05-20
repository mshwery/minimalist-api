export type Difference<A, B> = Pick<A, Exclude<keyof A, keyof B>>

export type Maybe<T> = T | null
