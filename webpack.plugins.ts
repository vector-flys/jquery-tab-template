import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

import webpack from "webpack";
export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  // new webpack.ProvidePlugin({
  //   $: "jquery",
  //   jQuery: "jquery",
  // }),
  new CopyPlugin({
    patterns: [
      {
        from: "jquery.min.js",
        to: "jquery",
        context: "node_modules/jquery/dist",
      },
      {
        from: "jquery-ui.min.js",
        to: "jquery",
        context: "node_modules/jquery-ui/dist",
      },
      {
        // from: "themes/**",
        from: "themes/eggplant/**",
        to: "jquery",
        context: "node_modules/jquery-ui/dist",
      },
    ],
  }),
];
