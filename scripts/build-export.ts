import changeCase from 'change-case'
import fs from 'fs/promises'
import glob from 'glob'
import path from 'path'
import { transform } from '@svgr/core'
import { buildSync, transformSync } from 'esbuild'

const DIRECTORY_SOURCE = './src'
const DIRECTORY_OUTPUT = './dist'

const optimisedComponentTemplate = (
  { props, imports, componentName, jsx },
  { tpl }
) => tpl`${imports};export const ${componentName} = (${props}) => ${jsx}`

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUselessStrokeAndFill: false
        }
      }
    },
    { name: 'removeAttrs', params: { attrs: 'aria-labelledby' } },
    { name: 'removeDimensions' },
    { name: 'removeTitle' }
  ]
}

const exists = async (path: string) => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

const outputESEntry = async (icons) => {
  const template = await createESExportString(icons)
  await fs.writeFile(path.resolve(DIRECTORY_OUTPUT, 'index.js'), template)
}

const outputCJSBundle = async () => {
  await buildSync({
    entryPoints: [path.resolve(DIRECTORY_OUTPUT, 'index.js')],
    outfile: path.resolve(DIRECTORY_OUTPUT, 'index.cjs.js'),
    format: 'cjs',
    bundle: true,
    external: ['react'],
    minify: true
  })
}

const createESExportString = async (icons: Record<string, string>) => {
  // access all svg file paths from location
  // const filePaths = await glob.sync(`${source}/*.svg`)
  // apply export template to each and combine into single string
  return Object.entries(icons)
    .map(([name]) => `export * from './${name}'\n`)
    .join('')
}

const getIconExports = async (
  source: string
): Promise<Record<string, string>> => {
  const filePaths = await glob.sync(`${source}/*.svg`)

  return filePaths.reduce(
    (collection, filePath) => ({
      ...collection,
      [path.basename(filePath, path.extname(filePath))]: filePath
    }),
    {}
  )
}

const transformIcon = async (name: string, source: string) => {
  try {
    const svgSource = await fs.readFile(source, { encoding: 'utf8' })

    const svgAsComponent = await transform(
      svgSource,
      {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig,
        template: optimisedComponentTemplate
      },
      { componentName: changeCase.pascalCase(name) }
    )

    return await transformSync(svgAsComponent, {
      loader: 'jsx',
      minify: true
    })
  } catch (err) {
    console.error(err)
  }
}

const run = async () => {
  const systemIcons = await getIconExports('./node_modules/ikonate/icons')
  const customIcons = await getIconExports(DIRECTORY_SOURCE)
  const icons = { ...systemIcons, ...customIcons }

  const dirOutputExists = await exists(DIRECTORY_OUTPUT)

  if (!dirOutputExists) {
    await fs.mkdir(DIRECTORY_OUTPUT)
  }

  await outputESEntry(icons)

  for (const [name, source] of Object.entries(icons)) {
    const { code } = await transformIcon(name, source)
    await fs.writeFile(path.resolve(DIRECTORY_OUTPUT, `${name}.js`), code)
  }

  await outputCJSBundle()
}

run()
