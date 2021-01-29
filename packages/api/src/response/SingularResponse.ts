import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SingularResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model
  ) {
    super(httpClientResponse, model)

    this.data = this.resolveData()
  }

  private mutate(record: Element): M {
    return new this.model(record) as M
  }

  private resolveData(): M | null {
    let data = this.httpClientResponse.getData<
      SingularData | Wrapped<SingularData>
    >()

    if (!data || !(data = unwrap(data)) || !(data = variadic(data))) {
      return null
    }

    return this.mutate(data)
  }
}
