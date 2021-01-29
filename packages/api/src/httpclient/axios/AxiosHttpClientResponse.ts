import { AxiosResponse } from 'axios'

import { HttpClientResponse } from '../HttpClientResponse'

export class AxiosHttpClientResponse implements HttpClientResponse {
  private readonly axiosResponse: AxiosResponse

  public constructor(axiosResponse: AxiosResponse) {
    this.axiosResponse = axiosResponse
  }

  public getData<T = unknown>(): T {
    return this.axiosResponse.data
  }

  public getUnderlying(): unknown {
    return this.axiosResponse
  }
}
