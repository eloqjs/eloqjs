import { Element, Item, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { assert, isNullish, isObject, variadic } from '../support/Utils'
import { Response } from './Response'

export type SingularData = Element | Element[] | null | undefined

export class RecordResponse<M extends Model = Model> extends Response {
  public readonly data: Item<M> = null

  public constructor(httpClientResponse: HttpClientResponse | null, model: typeof Model) {
    super(httpClientResponse, model)

    this.data = this.resolveData()
  }

  protected resolveData(): Item<M> {
    let data = this.getDataFromResponse()

    if (isNullish((data = variadic(data)))) {
      return null
    }

    assert(isObject(data), [
      'Response data must be an object.',
      `Received ${typeof data}.`,
      'See `dataKey` and `dataTransformer` options.'
    ])

    return this._mutate(data)
  }

  private _mutate(record: Element): M {
    return this.model.instantiate(record) as M
  }
}
