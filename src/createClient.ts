import Discord from 'discord.js'

import loadCommands from './loadCommands'
import { channelRegex, userRegex, emojiRegex } from './utils/regex'

export default async function ({ config }: Dependencies) {
  const commandMap = await loadCommands()
  const client = new Discord.Client()

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
  })

  client.on('message', async message => {
    // Ignore messages that are not from a guild
    if (!message.guild) return

    const [startsWith, ...args] = message.content.split(' ')
    // Pull out array of commands for startsWith string
    const commands = commandMap[startsWith.toLowerCase()] || []
    for (const command of commands) {
      // Ensure message matches command options
      let options: string[] = []
      let matches = 0
      if (command.requiredOptions) {
        options = args.slice(0, command.requiredOptions.length)
        for (let i = 0; i < options.length; i++) {
          if (options[i] === command.requiredOptions[i]) {
            matches++
          } else {
            break
          }
        }
      }

      // If options match up
      if (matches === options.length) {
        let parameters: string[] = []
        if (command.requiredParameters) {
          parameters = args.slice(options.length, command.requiredParameters.length)
          let invalidCommand = false
          for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i]
            const requiredParameter = command.requiredParameters[i]

            // Validate types
            switch (requiredParameter[1]) {
              case 'string':
                if (typeof parameter !== 'string') invalidCommand = true
                break
              case 'number':
                if (typeof parameter !== 'number') invalidCommand = true
                break
              case 'object':
                if (typeof parameter !== 'object') invalidCommand = true
                break
              // Discord types
              case Discord.Channel:
                const channelRegexArray = channelRegex.exec(parameter) || []
                if (!client.channels.get(channelRegexArray[1])) invalidCommand = true
                break
              case Discord.User:
                const userRegexArray = userRegex.exec(parameter) || []
                if (!client.users.get(userRegexArray[1])) invalidCommand = true
                break
              case Discord.Emoji:
                const emojiRegexArray = emojiRegex.exec(parameter) || []
                if (!client.emojis.get(emojiRegexArray[1])) invalidCommand = true
                break
            }
            if (invalidCommand) break
          }
          if (!invalidCommand) {
            try {
              await command.execute({ config })(message)
            } catch (error) {
              console.error('Command execution error:', error)
            }
            break
          }
        } else {
          try {
            await command.execute({ config })(message)
          } catch (error) {
            console.error('Command execution error:', error)
          }
          break
        }
      }
    }
  })

  await client.login(config.CLIENT_TOKEN)

  return client
}