export function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

export function capitalize<A extends string>(text: A): Capitalize<A> {
  return (text[0].toUpperCase() + text.slice(1)) as Capitalize<A>;
}

export type GetMapKeys<M extends Map<unknown, unknown>> = Parameters<
  M["set"]
>[0];

export type GetMapValues<M extends Map<unknown, unknown>> = Parameters<
  M["set"]
>[1];

// deno-lint-ignore no-explicit-any
export type AnyFunction = ((...args: any[]) => any);
