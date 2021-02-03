import './types/eloqjs'

/**
 * Model
 */
export { Model } from './model/Model'

/**
 * Attributes
 */
export * as Attributes from './attributes'

/**
 * Relationships
 */
export * as Relations from './relations'

/**
 * API
 */
// export * as ModelAPI from './model/api'
// export * as RelationsAPI from './relations/api'

export { ModelAPIInstance, ModelAPIStatic } from './model/api'
export { RelationAPI } from './relations/api'

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
