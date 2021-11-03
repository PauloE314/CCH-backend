export function generateRandomString(size: number) {
  return Math.random().toString(36).substr(2, size);
}

export function delay(n: number) {
  return new Promise<void>(resolve => setTimeout(resolve, n));
}
