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
 * @param filePath string of path
 * @returns string of file name without extension
 */
const getFileName = (filePath) =>
  path.basename(filePath, path.extname(filePath))

/**
 *
 * @param name string of SVG name in param case
 * @returns string of export
 */
const templateExport = (name, source) =>
  `export { ReactComponent as ${changeCase.pascalCase(
    name
  )} } from '${source}/${name}.svg'\n`

/**
 *
 * @param location string path to directory
 * @returns string of named ES exports
 */
const getESExportString = async (source) => {
  // access all svg file paths from location
  const filePaths = await glob.sync(`${source}/*.svg`)
  // apply export template to each and combine into single string
  return filePaths
    .map((filePath) => templateExport(getFileName(filePath), source))
    .join('')
}
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
    output: { file: pkg.main, format: 'cjs' }
  })
  await bundle.write({
    output: { file: pkg.module, format: 'esm' }
  })

  await bundle.close()
}

const run = async () => {
  const systemIconsExport = await getESExportString(
    './node_modules/ikonate/icons'
  )
  const customIconsExport = await getESExportString('./src')

  bundleFiles(`${systemIconsExport}\n${customIconsExport}`)
}

run()
