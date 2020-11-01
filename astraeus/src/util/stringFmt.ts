export function hashToPound(input: string) {
  return input.replace("#", "£");
}

export function poundToHash(input: string) {
  return input.replace("£", "#");
}
