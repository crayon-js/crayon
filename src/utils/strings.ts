// Copyright 2024 Im-Beast. All rights reserved. MIT license.
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

  let start = "";
  const searchLength = search.length;

  do {
    start += string.slice(0, searchIndex) + replaceValue;
    string = string.slice(searchIndex + searchLength);
    searchIndex = string.indexOf(search);
  } while (searchIndex !== -1);

  return start + string;
}
