import path from 'path';
import fs from 'fs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import lessToJS from 'less-vars-to-js';
import packageJson from './package.json';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import inject from '@rollup/plugin-inject';

const themeVars = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/theme.less'), 'utf8'),
);

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    inject({
      include: 'node_modules/audio-recorder-polyfill/**',
      window: 'global/window',
      navigator: path.resolve('src/helpers/global-shim/navigator.js'),
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    typescript(),
    babel({
      babelHelpers: 'runtime',
      babelrc: false,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true,
          },
        ],
        ['import', { libraryName: 'antd', style: true }],
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: /\**node_modules\**/,
    }),
    postcss({
      extensions: ['.css', '.scss', '.less'],
      use: [
        'sass',
        ['less', { javascriptEnabled: true, modifyVars: themeVars }],
      ],
    }),
    image(),
  ],
};
