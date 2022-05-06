export interface Class<T = never> {
  new (...args: unknown[]): T;
}
