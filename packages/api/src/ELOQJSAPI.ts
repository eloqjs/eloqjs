import { Collection, Model, PluginComponents, Relation } from '@eloqjs/core'

import { Config } from './contracts/Config'
import { Model as ModelMixin } from './mixins/model/Model'
import { Relation as RelationMixin } from './mixins/relations/Relation'

export class ELOQJSAPI {
  /**
   * The model class.
   */
  public model: typeof Model

  /**
   * The relation class.
   */
  public relation: typeof Relation

  /**
   * The collection class.
   */
  public collection: typeof Collection

  /**
   * The configuration object.
   */
  public config: Config

  /**
   * Create a new Vuex ORM Axios instance.
   */
  public constructor(components: PluginComponents, config: Config) {
    this.model = components.Model
    this.relation = components.Relation
    this.collection = components.Collection
    this.config = config
  }

  /**
   * Plug-in features.
   */
  public plugin(): void {
    ModelMixin(this.model, this.config)
    RelationMixin(this.relation)
  }
}
