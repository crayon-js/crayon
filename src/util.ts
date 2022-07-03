// Copyright 2022 Im-Beast. All rights reserved. MIT license.

/** Return whether NO_COLOR is set */
export function getNoColor(): boolean {
  if (isDeno()) {
    // @ts-ignore Deno compatibility
    return Deno.noColor;
  } else if (isNode()) {
    // @ts-ignore Node compatibility
    return !!process?.env?.["NO_COLOR"];
  }
  return false;
}

/**
 * Faster alternative to `String.prototype.replace`
 *
 * @param string - string which will be modified
 * @param search - string which first occurrence will be replaced
 * @param replaceValue - string which replaces search
 */
export function replace(
  string: string,
  search: string,
  replaceValue: string,
): string {
  const searchIndex = string.indexOf(search);
  if (searchIndex === -1) return string;
  return string.slice(0, searchIndex) + replaceValue +
    string.slice(searchIndex + search.length);
}

/**
 * Faster¹ alternative to `String.prototype.replaceAll`
 *
 * ¹ - it might be slower/on pair when strings are unusually long
 *
 * @param string - string which will be modified
 * @param search - string which first occurrence will be replaced
 * @param replaceValue - string which replaces search
 */
export function replaceAll(
  string: string,
  search: string,
  replaceValue: string,
) {
  let searchIndex = string.indexOf(search);
  if (searchIndex === -1) return string;

  const offset = search.length;
  const lookBackOffset = replaceValue.length;

  do {
    string = string.slice(0, searchIndex) + replaceValue +
      string.slice(searchIndex + search.length);
    searchIndex = string.indexOf(search, searchIndex - offset + lookBackOffset);
  } while (searchIndex !== -1);

  return string;
}

/** Return whether program is running in node runtime */
export function isNode() {
  // @ts-ignore Deno compatibility
  return globalThis?.process?.versions?.node != null;
}

/** Return whether program is running in deno runtime */
export function isDeno() {
  // @ts-ignore Node compatibility
  // deno-fmt-ignore
  return globalThis?.Deno?.version?.deno !== null && !isNode();
}

/** Get keys of a map */
export type GetMapKeys<M extends Map<unknown, unknown>> = Parameters<
  M["set"]
>[0];

/** Get values of a map */
export type GetMapValues<M extends Map<unknown, unknown>> = Parameters<
  M["set"]
>[1];
