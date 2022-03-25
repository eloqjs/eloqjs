export type Wrapped<T> = { data: T }

export type ValueOf<T, V extends keyof T = keyof T> = T[V]

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

export type DeepPartial<T> = T extends object
  ? T extends Date
    ? T
    : {
        [P in keyof T]?: DeepPartial<T[P]>
      }
  : T

export type LooseRequired<T> = { [P in string & keyof T]: T[P] }
