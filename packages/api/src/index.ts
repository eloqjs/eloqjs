import './types/eloqjs'

/**
 * Model
 */
export { Model } from './model/Model'

/**
 * API
 */
export { ModelAPIInstance, ModelAPIStatic } from './model/api'

/**
 * HTTP Client
 */
export type { HttpClient, HttpClientPromise, HttpClientResponse, Thenable } from './httpclient'
export { AxiosHttpClient, AxiosHttpClientPromise, AxiosHttpClientResponse } from './httpclient'

/**
 * Contracts
 */
export type { Config } from './contracts/Config'

/**
 * Plugin
 */
export type { Plugin, PluginComponents, PluginOptions, use } from './plugins/use'

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
