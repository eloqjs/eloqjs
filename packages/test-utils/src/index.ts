import { Collection, Element, Model } from '@eloqjs/core'

export function assertModel<M extends Model>(model: M, record: Element): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model>(
  models: Collection<M>,
  record: Element[]
): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf(
  collection: Collection<any>,
  model: typeof Model
): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}
