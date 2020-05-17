import path from 'path'
import glob from 'glob-promise'

import { Command } from './lib/Command'

interface CommandMap {
  [key: string]: Command[]
}

export default async function () {
  const commandDir = path.join(__dirname, 'commands')
  const commandFiles = await glob(commandDir + '**/**/*.ts')
  const commands: Command[] = commandFiles.map(commandFile => {
    return require(commandFile)
  })

  const commandMap: CommandMap = {}
  for (const command of commands) {
    commandMap[command.startsWith]
      ? commandMap[command.startsWith].push(command)
      : commandMap[command.startsWith] = [command]
  }
  return commandMap
}