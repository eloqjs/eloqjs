import { Relations } from '@eloqjs/core'

import { HasManyAPI } from '../../relations/api'

export function HasMany(relation: typeof Relations.HasMany): void {
  relation.prototype.api = function (): HasManyAPI {
    return new HasManyAPI(this.model, this.belongsToModel, this.data, this.key)
  }
}
