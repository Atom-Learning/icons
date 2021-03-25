// import commonjs from '@rollup/plugin-commonjs'
// import resolve from '@rollup/plugin-node-resolve'
// import typescript from '@rollup/plugin-typescript'
import svgr from '@svgr/rollup'
import virtual from '@rollup/plugin-virtual'
// import bundleSize from 'rollup-plugin-bundle-size'
// import { terser } from 'rollup-plugin-terser'
import url from 'rollup-plugin-url'
// import visualizer from 'rollup-plugin-visualizer'
import alias from '@rollup/plugin-alias'
import pkg from './package.json'

const deps = Object.keys(pkg.dependencies || {})
const peerDeps = Object.keys(pkg.peerDependencies || {})

console.log(global.exportFile)

export default {
  input: 'hello',
  external: [...peerDeps],
  output: [
    // { file: pkg.main, format: 'cjs' },
    { file: pkg.main, format: 'esm' }
  ],
  plugins: [
    virtual({
      hello: `console.log("hello!");`
    }),
    alias({
      entries: [{ find: 'ikonate', replacement: '../node_modules/ikonate' }]
    }),
    // bundleSize(),
    // commonjs(),
    // resolve(),
    // isProduction && terser(),
    svgr(),
    // typescript(),
    url()
    // debug && visualizer()
  ]
}
