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

    this.data = new Collection<M>([], {
      model: this.model
    })

    this._resolveData()
  }

  private _resolveData(): void {
    let data = this.httpClientResponse.getData<
      PluralData | Wrapped<PluralData>
    >()

    if (!data || !(data = unwrap(data))) {
      return
    }

    for (let record of data) {
      // TODO: Improve format support
      record = 'data' in record ? (record.data as Element) : record

      this.data.add(record)
    }
  }
}
