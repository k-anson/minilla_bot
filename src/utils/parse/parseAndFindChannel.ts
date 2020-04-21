import Discord from 'discord.js'

export default function (channel: string, channels: { [key: string]: Discord.Channel }): Discord.Channel | null {
  const parse = /#(\d+)>/.exec(channel)
  if (!parse) return null
  const parsedChannel = parse[1]
  for (const item in channels) {
    if (item === parsedChannel) {
      return channels[item]
    }
  }
  return null
}