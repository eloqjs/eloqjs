import { Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SaveResponse<M extends Model = Model> extends Response {
  public readonly data: M

  public constructor(httpClientResponse: HttpClientResponse | null, model: M) {
    super(httpClientResponse, model.$self())

    this.data = this.resolveData(model)
  }

  protected resolveData(model: M): M {
    if (!this.httpClientResponse) {
      return model
    }

    let data = this.httpClientResponse.getData<
      SingularData | Wrapped<SingularData>
    >()

    if (data && (data = unwrap(data)) && (data = variadic(data))) {
      model.$fill(data)
    }

    return model
  }
}
