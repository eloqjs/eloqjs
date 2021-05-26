import { Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { isNull } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SaveResponse<M extends Model = Model> extends Response {
  public readonly data: M

  public constructor(httpClientResponse: HttpClientResponse | null, model: M) {
    super(httpClientResponse, model.$self())

    this.data = this.resolveData(model)
  }

  protected resolveData(model: M): M {
    const data = this.getDataFromResponse<Element>()

    if (!isNull(data)) {
      model.$fill(data)
    }

    return model
  }
}
