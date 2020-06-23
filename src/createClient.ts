import Discord from 'discord.js'
import EmojiRegex from 'emoji-regex'

import loadCommands from './loadCommands'
import { channelRegex, userRegex, guildEmojiRegex } from './utils/regex'

export default async function ({ config }: Dependencies) {
  const client = new Discord.Client()
  const commandMap = await loadCommands()

  client.on('ready', () => {
    if (client.user) {
      console.log(`Logged in as ${client.user.tag}`)
    } else {
      console.log('Client ready without User')
    }
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
          parameters = args.slice(options.length, command.requiredParameters.length + 1)
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
                if (typeof parameter === 'string') {
                  parsedParam = parameter
                }
                break
              case 'number':
                if (typeof parameter === 'number') {
                  parsedParam = Number.parseInt(parameter)
                }
                break
              // Discord types
              case Discord.TextChannel:
                const channelRegexArray = channelRegex.exec(parameter) || []
                parsedParam = message.guild.channels.resolve(channelRegexArray[1])
                break
              case Discord.User:
                const userRegexArray = userRegex.exec(parameter) || []
                parsedParam = client.users.resolve(userRegexArray[1])
                break
              case Discord.Emoji:
                // Check guild emojis
                const guildEmojiRegexArray = guildEmojiRegex.exec(parameter) || []
                parsedParam = client.emojis.resolve(guildEmojiRegexArray[1])
                // Check unicode emojis
                const emojiRegex = EmojiRegex()
                const parsedRegex = emojiRegex.exec(parameter)
                if (!parsedParam && parsedRegex) parsedParam = parsedRegex[0]
                break
            }
            // Add validated and parsed value to parsedParam object
            if (parsedParam) {
              parsedParams[requiredParameterName] = parsedParam
            } else {
              // Exit invalid command
              invalidCommand = true
              break
            }
          }
          if (!invalidCommand) {
            try {
              await command.execute({ config })({ message, guild: message.guild }, parsedParams)
            } catch (error) {
              console.error('Command execution error:', error)
            }
            break
          }
        } else {
          try {
            await command.execute({ config })({ message, guild: message.guild }, parsedParams)
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