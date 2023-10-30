export type MaybeLiteral<T extends string> = T | (string & {});

export async function collectAsync<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const result: Array<T> = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
