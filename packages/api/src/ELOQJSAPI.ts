import { Model, PluginComponents } from '@eloqjs/core'

import { Config } from './contracts/Config'
import { Model as ModelMixin } from './mixins/model/Model'

export class ELOQJSAPI {
  /**
   * The model class.
   */
  public model: typeof Model

  /**
   * The configuration object.
   */
  public config: Config

  /**
   * Create a new Vuex ORM Axios instance.
   */
  public constructor(components: PluginComponents, config: Config) {
    this.model = components.Model
    this.config = config
  }

  /**
   * Plug-in features.
   */
  public plugin(): void {
    ModelMixin(this.model, this.config)
  }
}
