import { Message, Guild } from "discord.js";

declare global {
  interface DiscordObjects {
    message: Message
    guild: Guild
  }
}

export type RequiredParameter = [string, any]

export interface Command {
  startsWith: string
  tooltip: string
  requiredOptions?: string[]
  requiredParameters?: RequiredParameter[]
  execute: ({}: Dependencies) => ({}: DiscordObjects, params?: { [key: string]: any }) => Promise<void>
}