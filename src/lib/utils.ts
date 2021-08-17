/**
 * Converts input to a boolean.
 */
export function toBoolean(input: string | number | boolean) {
  // Values which are probably intended to be `false`.
  const exceptions: (string | number | boolean)[] = ["false", "0", -1];
  return exceptions.includes(input) ? false : Boolean(input);
}
