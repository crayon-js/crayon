// Copyright 2022 Im-Beast. All rights reserved. MIT license.
interface Badge {
  label: string;
  message: string;
  color: string;
}

export async function generateBadge(
  path: string | URL,
  { label, message, color }: Badge,
): Promise<void> {
  const badge = await (await fetch(
    `https://img.shields.io/static/v1?label=${label}&message=${message}&color=${color}`,
  )).text();

  await Deno.writeTextFile(path, badge);
}
