export type Mutator<T> = (value: T) => T

export type Mutators = Record<string, Mutator<any>>
