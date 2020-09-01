import Discord from 'discord.js'

type requiredParameters = {
  messageChannel: Discord.TextChannel
  messageId: string
  emoji: Discord.GuildEmoji | string
  permissionChannel: Discord.TextChannel
}

export = {
  startsWith: '!rc',
  tooltip: '!rc add <channel> <messageId> <emoji> <channel>',
  requiredOptions: [
    'add'
  ],
  requiredParameters: [
    [ 'messageChannel', Discord.TextChannel ],
    [ 'messageId', 'string' ],
    [ 'emoji', Discord.GuildEmoji ],
    [ 'permissionChannel', Discord.TextChannel ]
  ],
  execute: ({ config }: Dependencies) => async ({ message, guild }: DiscordObjects, params: requiredParameters) => {

    const { messageChannel, messageId, emoji, permissionChannel } = params
    console.log(typeof messageId)
    console.log(messageId)
    const watchedMessage = await messageChannel.messages.fetch(messageId)
    if (!watchedMessage) return

    await watchedMessage.react(emoji)

    // Add watcher info to DB

    await message.channel.send('Pong!')
  }
}