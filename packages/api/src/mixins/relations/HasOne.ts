import { Relations } from '@eloqjs/core'

import { HasOneAPI } from '../../relations/api'

export function HasOne(relation: typeof Relations.HasOne): void {
  relation.prototype.api = function (): HasOneAPI {
    return new HasOneAPI(this.model, this.belongsToModel, this.data, this.key)
  }
}
