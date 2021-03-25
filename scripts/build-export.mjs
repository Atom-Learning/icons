// eslint-disable-next-line import/default
import alias from '@rollup/plugin-alias'
import changeCase from 'change-case'
import glob from 'glob'
import path from 'path'
import svgr from '@svgr/rollup'
import url from 'rollup-plugin-url'
import virtual from '@rollup/plugin-virtual'
import { rollup } from 'rollup'
import bundleSize from 'rollup-plugin-bundle-size'
// import { terser } from 'rollup-plugin-terser'
import pkg from '../package.json'

const inputGlob = './node_modules/ikonate/icons/*.svg'
/**
 *
 * @param name string of SVG name in param case
 * @returns string of export
 */
const templateExport = (name) =>
  `export { ReactComponent as ${changeCase.pascalCase(
    name
  )} } from 'ikonate/icons/${name}.svg'\n`

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
  const bundle = await rollup({
    input: 'entry',
    external: [...Object.keys(pkg.peerDependencies)],
    plugins: [
      bundleSize(),
      virtual({ entry }),
      alias({
        entries: [{ find: 'ikonate', replacement: './node_modules/ikonate' }]
      }),
      svgr.default(),
      url()
      // terser()
    ]
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
  const svgFilePaths = await glob.sync(inputGlob)

  const exportFileContents = svgFilePaths
    .map((filePath) => templateExport(getFileName(filePath)))
    .join('')

  bundleFiles(exportFileContents)
}

run()
