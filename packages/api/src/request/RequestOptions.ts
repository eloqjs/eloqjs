import { RequestMethod } from './RequestMethod'

export interface RequestOptions {
  url: string
  method: RequestMethod
  data?: unknown
}
