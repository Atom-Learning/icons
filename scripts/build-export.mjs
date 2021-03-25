import bundleSize from 'rollup-plugin-bundle-size'
import changeCase from 'change-case'
import glob from 'glob'
import path from 'path'
import svgr from '@svgr/rollup'
import url from 'rollup-plugin-url'
import virtual from '@rollup/plugin-virtual'
import * as rollup from 'rollup'
import { terser } from 'rollup-plugin-terser'

import pkg from '../package.json'
/**
 *
 * @param name string of SVG name in param case
 * @returns string of export
 */
const templateExport = (name) =>
  `export { ReactComponent as ${changeCase.pascalCase(
    name
  )} } from './node_modules/ikonate/icons/${name}.svg'\n`

/**
 *
 * @param filePath string of path
 * @returns string of file name without extension
 */
const getFileName = (filePath) =>
  path.basename(filePath, path.extname(filePath))

/**
 *
 * @param entry string contents to bundle
 */
const bundleFiles = async (entry) => {
  const bundle = await rollup.rollup({
    input: 'entry',
    external: [...Object.keys(pkg.peerDependencies)],
    plugins: [bundleSize(), virtual({ entry }), url(), svgr.default(), terser()]
  })

  await bundle.write({
    output: {
      file: pkg.main,
      format: 'esm'
    }
  })

  await bundle.close()
}

const run = async () => {
  // access all svg file paths from ikonate
  const svgFilePaths = await glob.sync('./node_modules/ikonate/icons/*.svg')
  // apply export template to each and combine into single string
  const exportFileContents = svgFilePaths
    .map((filePath) => templateExport(getFileName(filePath)))
    .join('')
  // use that template as the entry for rollup bundle
  bundleFiles(exportFileContents)
}

run()
