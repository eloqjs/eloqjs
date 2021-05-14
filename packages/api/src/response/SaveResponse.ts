import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { forceArray, unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SaveResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  private readonly _hooks: string[]

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: M,
    hooks: string | string[] = []
  ) {
    super(httpClientResponse, model.$self())

    this._hooks = forceArray(hooks)
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

    return this._hooks.reduce((model, on) => {
      this.model.executeMutationHooks(on, model)
      return model
    }, data as Item<M>)
  }
}
