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
  )} } from '${source}'\n`

/**
 *
 * @param source location string path to directory
 * @returns object of icon paths with icon name as key
 */
const getExports = async (source) => {
  const filePaths = await glob.sync(`${source}/*.svg`)

  return filePaths.reduce(
    (collection, filePath) => ({
      ...collection,
      [getFileName(filePath)]: filePath
    }),
    {}
  )
}

/**
 *
 * @param source location string path to directory
 * @returns string of named ES exports
 */
const getESExportString = async (icons) => {
  // access all svg file paths from location
  // const filePaths = await glob.sync(`${source}/*.svg`)
  // apply export template to each and combine into single string
  return Object.entries(icons)
    .map(([name, path]) => templateExport(name, path))
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
  const systemIcons = await getExports('./node_modules/ikonate/icons')
  const customIcons = await getExports('./src')

  const iconsExportTemplate = await getESExportString({
    ...systemIcons,
    ...customIcons
  })

  bundleFiles(iconsExportTemplate)
}

run()
