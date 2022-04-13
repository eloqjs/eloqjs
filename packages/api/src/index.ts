import './types/eloqjs'

/**
 * API
 */
export * from './model'

/**
 * HTTP Client
 */
export * from './httpclient'

/**
 * Contracts
 */
export * from './contracts/Config'

/**
 * Plugin
 */
export * from './plugins/use'

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
