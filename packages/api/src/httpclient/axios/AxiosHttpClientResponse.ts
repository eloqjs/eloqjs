import { AxiosResponse } from 'axios'

import { HttpClientResponse } from '../HttpClientResponse'

export class AxiosHttpClientResponse implements HttpClientResponse {
  private readonly _axiosResponse: AxiosResponse

  public constructor(axiosResponse: AxiosResponse) {
    this._axiosResponse = axiosResponse
  }

  public getData<T = unknown>(): T {
    return this._axiosResponse.data
  }

  public getUnderlying(): unknown {
    return this._axiosResponse
  }
}
