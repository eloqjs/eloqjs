import { AxiosPromise, AxiosResponse } from 'axios'

import { isUndefined } from '../../support/Utils'
import { HttpClientPromise } from '../HttpClientPromise'
import { HttpClientResponse } from '../HttpClientResponse'
import { Thenable } from '../Thenable'
import { AxiosHttpClientResponse } from './AxiosHttpClientResponse'

export class AxiosHttpClientPromise implements HttpClientPromise {
  private axiosPromise: AxiosPromise

  public constructor(axiosPromise: AxiosPromise) {
    this.axiosPromise = axiosPromise
  }

  public then<U>(
    onFulfilled?: (value: HttpClientResponse) => Thenable<U> | U,
    onRejected?: (error: unknown) => Thenable<U> | U
  ): Promise<U>
  public then<U>(
    onFulfilled?: (value: HttpClientResponse) => Thenable<U> | U,
    onRejected?: (error: unknown) => void
  ): Promise<U> {
    const wrappedOnFulfilled = !isUndefined(onFulfilled)
      ? (axiosResponse: AxiosResponse<unknown>) =>
          onFulfilled(new AxiosHttpClientResponse(axiosResponse))
      : undefined
    return <Promise<U>>this.axiosPromise.then(wrappedOnFulfilled, onRejected)
  }

  public catch<U>(
    onRejected?: (error: unknown) => Thenable<U> | U
  ): Promise<U> {
    return <Promise<U>>this.axiosPromise.catch(onRejected)
  }
}
