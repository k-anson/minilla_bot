import Discord from 'discord.js'
import path from 'path'
import glob from 'glob-promise'

interface Command {
  startsWith: string
  run: ({}: Dependencies) => (message: Discord.Message) => void
  requiredParameters?: string[]
}

export default async function ({ config }: Dependencies) {
  const client = new Discord.Client()

  const commandDir = path.join(__dirname, 'commands')
  const commandFiles = await glob(commandDir + '**/*.ts')
  const commands = await Promise.all<Command>(commandFiles.map(async commandFile => {
    const command: Command = await import(commandFile)
    return command
  }))

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
  })

  client.on('message', message => {
    // Ignore messages that are not from a guild
    if (!message.guild) return

    // Run through each command
    const [startsWith, ...parameters] = message.content.split(' ')
    for (const command of commands) {
      if (startsWith === command.startsWith) {
        if (command.requiredParameters) {
          const requiredParameters = parameters.slice(0, command.requiredParameters.length)
          if (requiredParameters != command.requiredParameters) {
            continue
          }
        }
        command.run({ config })(message)
      }
    }
  })

  await client.login(config.CLIENT_TOKEN)

  return client
}