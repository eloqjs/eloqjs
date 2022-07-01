import ELOQJS, { Model } from '@eloqjs/core'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import ELOQJSAPI from '../src'
import { AxiosHttpClient } from '../src/httpclient/axios'

// Set axios as http client of the model
const axiosClient = new AxiosHttpClient(axios)
axiosClient.setBaseUrl('http://localhost')

ELOQJS.use(ELOQJSAPI, { httpClient: axiosClient })

export const axiosMock = new MockAdapter(axiosClient.getImplementingClient())

beforeEach(() => {
  axiosMock.reset()
  Model.clearBootedModels()
})
