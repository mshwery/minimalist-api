/**
 * Moves an item from one position in an array to another
 * @returns a shallow copy of the array (new array instance, but the items are the same instances)
 */
export function move<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const arr = Array.from(items)
  const item = arr.splice(fromIndex, 1)[0]
  arr.splice(toIndex, 0, item)
  return arr
}
