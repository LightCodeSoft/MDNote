import typescript from "rollup-plugin-typescript";
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import { minify } from 'uglify-es';
import sourceMaps from "rollup-plugin-sourcemaps";
export default [
  {
    input: "./src/Win.ts",
    plugins: [
      typescript({
        exclude: "node_modules/**",
        typescript: require("typescript")
      }),
      sourceMaps()
    ],
    output: [
      {
        format: "umd",
        name: "kb",
        extend: true,
        file: "./dist/main.js",
      }
    ]
  },
  /****compress */
  // {
  //   input: "./src/Win.ts",
  //   plugins: [//for index
  //     typescript({
  //       exclude: "node_modules/**",
  //       typescript: require("typescript")
  //     }),
  //     terser(),
  //     filesize()
  //   ],
  //   output: [
  //     {
  //       format: "umd",
  //       name: "kb",
  //       extend: true,
  //       file: "./dist/main.min.js",
  //     }
  //   ]
  // },
];