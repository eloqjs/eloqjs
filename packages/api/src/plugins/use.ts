import {
  Attributes,
  Model,
  PluginComponents as PluginComponentsCore,
  Relations
} from '@eloqjs/core'

import { Model as ModelAPI } from '../model/Model'

export interface PluginComponents extends PluginComponentsCore {
  ModelAPI: typeof ModelAPI
}

export interface Options {
  [key: string]: any
}

export interface Plugin {
  [key: string]: any
}

export function use(plugin: Plugin, options: Options = {}): void {
  const components: PluginComponents = {
    Model,
    ModelAPI,
    Attributes,
    Relations
  }

  plugin.install(components, options)
}
