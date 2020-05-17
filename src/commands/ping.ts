import Discord from 'discord.js'

export = {
  startsWith: '!ping',
  tooltip: '!ping',
  execute: ({ config }: Dependencies) => async (message: Discord.Message) => {
    try {
      await message.channel.send('Pong!')
    } catch (error) {
      console.log('Discord message error:', error)
    }
  }
}