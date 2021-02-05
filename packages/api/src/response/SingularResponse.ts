import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { forceArray, unwrap, variadic, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class SingularResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  private readonly hooks: string[]

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model,
    hooks: string | string[] = []
  ) {
    super(httpClientResponse, model)

    this.hooks = forceArray(hooks)
    this.data = this.resolveData()
  }

  private mutate(record: Element): M {
    return new this.model(record) as M
  }

  protected resolveData(): Item<M> {
    let data = this.httpClientResponse.getData<
      SingularData | Wrapped<SingularData>
    >()

    if (!data || !(data = unwrap(data)) || !(data = variadic(data))) {
      return null
    }

    data = this.mutate(data)

    return this.hooks.reduce<Item<M>>((model, on) => {
      this.model.executeMutationHooks(on, model)
      return model
    }, data)
  }
}
