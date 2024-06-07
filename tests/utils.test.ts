// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { capitalize } from "../src/utils/capitalize.ts";
import { replace, replaceAll } from "../src/utils/strings.ts";

import { assertEquals } from "@std/assert";

Deno.test("capitalize()", () => {
  assertEquals(capitalize("dog"), "Dog");
  assertEquals(capitalize("d"), "D");
  assertEquals(capitalize("big fluffy dog"), "Big fluffy dog");
});

Deno.test("replace()", () => {
  assertEquals(replace("Hello world", " world", ""), "Hello");
  assertEquals(replace("Cat likes pets", "Cat", "Dog"), "Dog likes pets");
  assertEquals(replace("", "a", ""), "");
  assertEquals(replace("a", "a", ""), "");
  assertEquals(replace("dog dog dog dog dog", "dog", ""), " dog dog dog dog");
});

Deno.test("replaceAll()", () => {
  assertEquals(replaceAll("Hello worldy world", " world", ""), "Helloy");
  assertEquals(replaceAll("Cat likes pets", "Cat", "Dog"), "Dog likes pets");
  assertEquals(replaceAll("", "a", ""), "");
  assertEquals(replaceAll("a", "a", ""), "");
  assertEquals(replaceAll("dog dog dog dog dog", "dog ", ""), "dog");
});
