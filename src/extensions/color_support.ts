// Copyright 2024 Im-Beast. All rights reserved. MIT license.
interface ColorSupport {
  trueColor: boolean;
  highColor: boolean;
  fourBitColor: boolean;
  threeBitColor: boolean;
}

const CIs = [
  "TRAVIS",
  "CIRCLECI",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
  "BUILDKITE",
  "DRONE",
  "APPVEYOR",
];

let trueColor = false;
let highColor = false;
let fourBitColor = false;
let threeBitColor = false;

function colorSupport(): ColorSupport {
  return {
    trueColor,
    highColor,
    fourBitColor,
    threeBitColor,
  };
}

export interface GetColorSupportOptions {
  forcePermissions?: boolean;
  requestPermissions?: boolean;
  revokePermissions?: boolean;
}

export async function getColorSupport({
  forcePermissions,
  requestPermissions,
  revokePermissions,
}: GetColorSupportOptions = {}): Promise<ColorSupport> {
  threeBitColor =
    fourBitColor =
    highColor =
    trueColor =
      false;

  if (Deno.noColor) return colorSupport();

  const request = (name: Deno.PermissionName) => {
    if (requestPermissions) {
      Deno.permissions.request({ name });
    }
  };

  const revoke = (name: Deno.PermissionName) => {
    if (revokePermissions) {
      Deno.permissions.revoke({ name });
    }
  };

  const permissionState = async (name: Deno.PermissionName) =>
    (await Deno.permissions.query({ name })).state;

  await request("env");

  if (forcePermissions || await permissionState("env") === "granted") {
    const colorTerm = Deno.env.get("COLORTERM");

    if (colorTerm !== undefined) {
      switch (colorTerm) {
        case "truecolor":
          threeBitColor =
            fourBitColor =
            highColor =
            trueColor =
              true;
          revoke("env");
          return colorSupport();
        default:
          threeBitColor = fourBitColor = true;
          revoke("env");
          return colorSupport();
      }
    }

    const term = Deno.env.get("TERM");
    if (term && /-?256(color)?/gi.test(term)) {
      threeBitColor = fourBitColor = highColor = true;
      revoke("env");
      return colorSupport();
    }

    const ci = Deno.env.get("CI");
    if (ci !== undefined && CIs.some((ci) => Deno.env.get(ci) !== undefined)) {
      threeBitColor = fourBitColor = true;
      revoke("env");
      return colorSupport();
    }

    if (Deno.build.os === "windows") {
      const [version, releaseNum] = Deno.osRelease().split(".").map(Number);
      if (releaseNum >= 14931 || version > 10) {
        revoke("env");
        threeBitColor =
          fourBitColor =
          highColor =
          trueColor =
            true;
        return colorSupport();
      }
    }
  }

  await request("run");

  if (forcePermissions || await permissionState("run") === "granted") {
    const command = new Deno.Command("tput", {
      args: ["colors"],
    });

    const child = command.spawn();

    const { stdout } = await child.output();
    if (stdout) {
      const tputColors = +(new TextDecoder().decode(stdout) || 0);

      threeBitColor = tputColors >= 4 || threeBitColor;
      fourBitColor = tputColors >= 8 || fourBitColor;
      highColor = tputColors >= 256 || highColor;
      trueColor = tputColors >= 16777216 || trueColor;
      revoke("run");
      return colorSupport();
    }
  }

  return colorSupport();
}
