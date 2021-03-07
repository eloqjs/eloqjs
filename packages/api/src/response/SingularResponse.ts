import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { forceArray, unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SingularResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  private readonly _hooks: string[]

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model,
    hooks: string | string[] = []
  ) {
    super(httpClientResponse, model)

    this._hooks = forceArray(hooks)
    this.data = this.resolveData()
  }

  protected resolveData(): Item<M> {
    let data = this.httpClientResponse.getData<
      SingularData | Wrapped<SingularData>
    >()

    if (!data || !(data = unwrap(data)) || !(data = variadic(data))) {
      data = null
    } else {
      data = this._mutate(data)
    }

    return this._hooks.reduce((model, on) => {
      this.model.executeMutationHooks(on, model)
      return model
    }, data as Item<M>)
  }

  private _mutate(record: Element): M {
    return new this.model(record) as M
  }
}
