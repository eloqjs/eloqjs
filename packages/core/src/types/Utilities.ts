export type Wrapped<T> = { data: T }

export type ValueOf<T, V extends keyof T = keyof T> = T[V]

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
