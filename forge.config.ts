import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";
import path from "path";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    overwrite: true,
    // prune: false, // do not prune node_modules - creates an app.asar ~500MB
    // ignore: ["^/src", "^/out", "^/dist"],
    // It appears that the regular dependencies were getting pruned out as well as dev dependencies
    //   so we have to manually copy them to the same place webpack would have put them...
    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        const fs = require("fs-extra");
        const src = path.join(__dirname, "node_modules/jquery/dist");
        const dest = path.join(
          buildPath,
          ".webpack/renderer/main_window/jquery"
        );
        fs.copy(src, dest, callback);
      },
      (buildPath, electronVersion, platform, arch, callback) => {
        const fs = require("fs-extra");
        const src = path.join(__dirname, "node_modules/jquery-ui/dist");
        const dest = path.join(
          buildPath,
          ".webpack/renderer/main_window/jquery"
        );
        fs.copy(src, dest, callback);
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "jquery-tab-template",
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
