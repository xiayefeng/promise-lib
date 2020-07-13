import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/main.ts',
  output: [
    {
      format: 'cjs',
      file: './lib/main.js',
      exports: 'named'
    },
    {
      format: 'iife',
      name: 'promiseParallelSerial',
      file: './dist/promise-parallel.min.js',
      exports: 'named'
    },
    {
      format: 'esm',
      file: './lib/index.js'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    (process.env.NODE_ENV === 'production' && terser())
  ]
};