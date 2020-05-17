import Discord from 'discord.js'

export function parseAndFindMember (member: string, members: { [key: string]: Discord.GuildMember }): Discord.GuildMember | null {
  const parse = /<@!(\d+)>/.exec(member)
  if (!parse) return null
  const parsedMember = parse[1]
  for (const item in members) {
    if (item === parsedMember) {
      return members[item]
    }
  }
  return null
}