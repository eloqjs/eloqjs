export function resolveNullable(nullable: any, relation: any): boolean {
  if (relation) {
    return true
  }

  return nullable === true
}
