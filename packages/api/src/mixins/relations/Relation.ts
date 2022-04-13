import { Relation as BaseRelation } from '@eloqjs/core'

import { RelationAPI } from '../../relations'

export function Relation(relation: typeof BaseRelation): void {
  relation.prototype.api = function (): RelationAPI {
    return new RelationAPI(this.model, this.belongsToModel, this.data, this.key, this.forceSingular)
  }
}
