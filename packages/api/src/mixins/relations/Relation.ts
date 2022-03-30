import { Relations } from '@eloqjs/core'

import { RelationAPI } from '../../relations/api'

export function Relation(relation: typeof Relations.Relation): void {
  relation.prototype.api = function (): RelationAPI {
    return new RelationAPI(this.model, this.belongsToModel, this.data, this.key, this.forceSingular)
  }
}
