
import { Model } from '../model/Model'

export interface PluginComponents {
  Model: typeof Model
}

export interface PluginOptions {
  [key: string]: any
}

export interface Plugin {
  [key: string]: any
}

export function use(plugin: Plugin, options: PluginOptions = {}): void {
  const components: PluginComponents = {
    Model
  }

  plugin.install(components, options)
}
