import Discord from 'discord.js'
import EmojiRegex from 'emoji-regex'

import loadCommands from './loadCommands'
import { channelRegex, userRegex, guildEmojiRegex } from './utils/regex'

export default async function ({ config }: Dependencies) {
  const client = new Discord.Client()
  const commandMap = await loadCommands()

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
        const parsedParams: { [key: string]: any } = {}
        let parameters: string[] = []
        if (command.requiredParameters) {
          parameters = args.slice(options.length, command.requiredParameters.length)
          let invalidCommand = false
          for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i]
            const requiredParameter = command.requiredParameters[i]
            const requiredParameterName = requiredParameter[0]
            const requiredParameterType = requiredParameter[1]

            // Validate types and parse values
            let parsedParam
            switch (requiredParameterType) {
              case 'string':
                if (typeof parameter !== 'string') {
                  invalidCommand = true
                  break
                }
                parsedParam = parameter
                break
              case 'number':
                if (typeof parameter !== 'number') {
                  invalidCommand = true
                  break
                }
                parsedParam = Number.parseInt(parameter)
                break
              // Discord types
              case Discord.Channel:
                const channelRegexArray = channelRegex.exec(parameter) || []
                parsedParam = client.channels.get(channelRegexArray[1])
                if (!parsedParam) invalidCommand = true
                break
              case Discord.User:
                const userRegexArray = userRegex.exec(parameter) || []
                parsedParam = client.users.get(userRegexArray[1])
                if (!parsedParam) invalidCommand = true
                break
              case Discord.Emoji:
                const emojiRegex = EmojiRegex()
                const guildEmojiRegexArray = guildEmojiRegex.exec(parameter) || []
                // Check guild emojis
                parsedParam = client.emojis.get(guildEmojiRegexArray[1])
                // Check unicode emojis
                parsedParam = emojiRegex.exec(parameter)
                if (parsedParam) parsedParam = parsedParam[0]
                if (!parsedParam) invalidCommand = true
                break
            }
            // Add validated and parsed value to parsedParam object
            if (invalidCommand) {
              break
            } else {
              parsedParams[requiredParameterName] = parsedParam
            }
          }
          if (!invalidCommand) {
            try {
              await command.execute({ config })(message, parsedParams)
            } catch (error) {
              console.error('Command execution error:', error)
            }
            break
          }
        } else {
          try {
            await command.execute({ config })(message, parsedParams)
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