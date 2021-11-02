export function generateRandomString(size: number) {
  return Math.random().toString(36).substr(2, size);
}
