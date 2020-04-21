import path from 'path'
import glob from 'glob-promise'

export default async function () {
  const utilDir = path.join(__dirname, 'utils')
  const utilFiles = await glob(utilDir + '**/*.ts')
  const utilFunctions = utilFiles.map(utilFile => {
    return require(utilFile)
  })

  const utils: { [key: string]: Function } = {}
  for (const util of utilFunctions) {
    utils[util.name] = util
  }
  return utils
}