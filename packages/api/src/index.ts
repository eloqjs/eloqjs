import './types/eloqjs'

/**
 * Model
 */
export { Model } from './model/Model'

/**
 * API
 */
export { API } from './api/API'
export { InstanceAPI } from './api/InstanceAPI'

/**
 * HTTP Client
 */
export {
  AxiosHttpClient,
  AxiosHttpClientPromise,
  AxiosHttpClientResponse,
  HttpClient,
  HttpClientPromise,
  HttpClientResponse,
  Thenable
} from './httpclient'

/**
 * Contracts
 */
export { Config } from './contracts/Config'

/**
 * Plugin
 */
export { Options, Plugin, PluginComponents, use } from './plugins/use'

/**
 * ELOQJS API (Default)
 */
import { PluginComponents } from '@eloqjs/core'

import { Config } from './contracts/Config'
import { ELOQJSAPI } from './ELOQJSAPI'
import { use } from './plugins/use'

export default {
  install(components: PluginComponents, config: Config): void {
    new ELOQJSAPI(components, config).plugin()
  },
  use
}
