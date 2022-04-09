import { Collection } from '../collection'
import { Model } from '../model'
import { Relation } from '../relations'

export interface PluginComponents {
  Model: typeof Model
  Collection: typeof Collection
  Relation: typeof Relation
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
    Collection,
    Relation
  }

  plugin.install(components, options)
}
