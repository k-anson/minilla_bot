import Discord from 'discord.js'

const startsWith = '!ping'
const run = ({ config }: Dependencies) => async (message: Discord.Message) => {
  await message.channel.send('pong')
}

export { startsWith, run }