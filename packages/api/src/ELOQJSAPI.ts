import { Model, PluginComponents, Relations } from '@eloqjs/core'

import { Config } from './contracts/Config'
import { Model as ModelMixin } from './mixins/model/Model'
// import { HasMany as HasManyMixin } from './mixins/relations/HasMany'
// import { HasOne as HasOneMixin } from './mixins/relations/HasOne'
import { Relation as RelationMixin } from './mixins/relations/Relation'

export class ELOQJSAPI {
  /**
   * The model class.
   */
  public model: typeof Model

  /**
   * The relations classes.
   */
  public relations: typeof Relations

  /**
   * The configuration object.
   */
  public config: Config

  /**
   * Create a new Vuex ORM Axios instance.
   */
  public constructor(components: PluginComponents, config: Config) {
    this.model = components.Model
    this.relations = components.Relations
    this.config = config
  }

  /**
   * Plug-in features.
   */
  public plugin(): void {
    ModelMixin(this.model, this.config)
    // HasOneMixin(this.relations.HasOne)
    // HasManyMixin(this.relations.HasMany)
    RelationMixin(this.relations.Relation)
  }
}
