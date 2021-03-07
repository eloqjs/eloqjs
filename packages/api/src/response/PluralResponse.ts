import { Collection, Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { unwrap, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type PluralData = Element[] | null | undefined

export class PluralResponse<M extends Model = Model> extends Response {
  public readonly data: Collection<M>

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model
  ) {
    super(httpClientResponse, model)

    this.data = this._resolveData()
  }

  private _mutate(records: Element[]): Collection<M> {
    return records.map((record) => {
      record = 'data' in record ? (record.data as Element) : record
      return new this.model(record)
    }) as Collection<M>
  }

  private _resolveData(): Collection<M> {
    let data = this.httpClientResponse.getData<
      PluralData | Wrapped<PluralData>
    >()

    if (!data || !(data = unwrap(data))) {
      return []
    }

    return this._mutate(data)
  }
}
