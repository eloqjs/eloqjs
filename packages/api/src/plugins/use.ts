export { Plugin, PluginComponents, PluginOptions } from '@eloqjs/core'

import { Collection, Model, Plugin, PluginComponents, PluginOptions, Relation } from '@eloqjs/core'

export function use(plugin: Plugin, options: PluginOptions = {}): void {
  const components: PluginComponents = {
    Model,
    Relation,
    Collection
  }

  plugin.install(components, options)
}
