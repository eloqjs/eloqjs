type NullableResolver = {
  nullable: any
}

export function resolveNullable({ nullable }: NullableResolver): boolean {
  return nullable === true
}
