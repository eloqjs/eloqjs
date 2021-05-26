import { Collection, Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { assert, isArray, isNull } from '../support/Utils'
import { Response } from './Response'

export class PluralResponse<
  M extends Model = Model,
  C extends Collection<M> = Collection<M>
> extends Response {
  public readonly data: C

  public constructor(
    httpClientResponse: HttpClientResponse | null,
    model: typeof Model,
    collection?: C
  ) {
    super(httpClientResponse, model)

    this.data = this._resolveCollection(collection)
    this._addModelsToCollection()
  }

  private _resolveCollection(collection?: C): C {
    if (collection) {
      return collection
    }

    return new Collection<M>([], {
      model: this.model
    }) as C
  }

  private _addModelsToCollection(): void {
    const data = this.getDataFromResponse<Element[]>()

    if (isNull(data)) {
      return
    }

    assert(isArray(data), [
      'Response data must be an array of records.',
      `Received ${typeof data}.`,
      'See `dataKey` and `dataTransformer` options.'
    ])

    for (const record of data) {
      this.data.add(record)
    }
  }
}
