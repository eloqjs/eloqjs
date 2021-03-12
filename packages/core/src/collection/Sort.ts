/**
 * Sort nullish values.
 *
 * @param {string|number|null|undefined} valueA
 * @param {string|number|null|undefined} valueB
 * @return {number}
 */
export function sortNullish(
  valueA: string | number | null | undefined,
  valueB: string | number | null | undefined
): number {
  if (valueA === null || valueA === undefined) {
    return 1
  }
  if (valueB === null || valueB === undefined) {
    return -1
  }

  return 0
}

/**
 * Sort values by grater or less than.
 *
 * @param {string|number} valueA
 * @param {string|number} valueB
 * @return {number}
 */
export function sortGreaterOrLessThan(
  valueA: string | number,
  valueB: string | number
): number {
  if (valueA < valueB) {
    return -1
  }

  if (valueA > valueB) {
    return 1
  }

  return 0
}
