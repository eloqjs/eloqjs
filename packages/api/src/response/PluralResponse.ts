import { Collection, Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { unwrap, Wrapped } from '../support/Utils'
import { Response } from './Response'

export type PluralData = Element[] | null | undefined

export class PluralResponse<
  M extends Model = Model,
  C extends Collection<M> = Collection<M>
> extends Response {
  public readonly data: C

  public constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model,
    collection?: C
  ) {
    super(httpClientResponse, model)

    this.data =
      collection ||
      (new Collection<M>([], {
        model: this.model
      }) as C)

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
      record = unwrap(record)

      this.data.add(record)
    }
  }
}
