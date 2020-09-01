import Discord from 'discord.js'

export = {
  startsWith: '!ping',
  tooltip: '!ping',
  execute: ({ config }: Dependencies) => async (message: Discord.Message) => {
    await message.channel.send('Pong!')
  }
}