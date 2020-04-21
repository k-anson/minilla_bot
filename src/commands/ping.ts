import Discord from 'discord.js'

export default {
  startsWith: '!ping',
  run: () => function (message: Discord.Message) {
    message.channel.send('pong')
  }
}