import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SaveResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  public constructor(httpClientResponse: HttpClientResponse, model: M) {
    super(httpClientResponse, model.$self())

    this.data = this.resolveData(model)
  }

  protected resolveData(model: M): Item<M> {
    let data = this.httpClientResponse.getData<
      SingularData | Wrapped<SingularData>
    >()

    if (!data || !(data = unwrap(data)) || !(data = variadic(data))) {
      data = null
    } else {
      model.$fill(data)
      data = model
    }

    return data as Item<M>
  }
}
