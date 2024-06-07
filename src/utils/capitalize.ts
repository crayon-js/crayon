// Copyright 2024 Im-Beast. All rights reserved. MIT license.
/** Makes first letter of a string capitalized */
export function capitalize<T extends string>(string: T): Capitalize<T> {
  return string[0].toUpperCase() + string.slice(1) as Capitalize<T>;
}
