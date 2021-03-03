import { Collection, Element, Model } from '../src'

export function assertModel<M extends Model>(model: M, record: Element): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertCollection<M extends Model>(
  collection: Collection<M>,
  records: M[] | Element[]
): void {
  collection.models.forEach((model, index) => {
    const record = records[index]

    if (record instanceof Model) {
      expect(model).toEqual(record)
    } else {
      expect(model.$toJson()).toEqual(record)
    }
  })
}

export function assertInstanceOf(
  collection: Collection<any>,
  model: typeof Model
): void {
  collection.models.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}
