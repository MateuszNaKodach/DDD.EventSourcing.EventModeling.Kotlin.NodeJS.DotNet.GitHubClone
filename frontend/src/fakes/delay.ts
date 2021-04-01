export function delay<T>(ms: number) {
  return function(x: T) {
    return new Promise<T>(resolve => setTimeout(() => resolve(x), ms));
  };
}
