import * as Attributes from '../attributes'
import { Model } from '../model/Model'
import * as Relations from '../relations'

export interface PluginComponents {
  Model: typeof Model
  Attributes: typeof Attributes
  Relations: typeof Relations
}

export interface PluginOptions {
  [key: string]: any
}

export interface Plugin {
  [key: string]: any
}

export function use(plugin: Plugin, options: PluginOptions = {}): void {
  const components: PluginComponents = {
    Model,
    Attributes,
    Relations
  }

  plugin.install(components, options)
}
