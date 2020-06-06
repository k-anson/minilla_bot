import { Message } from "discord.js";

export type RequiredParameter = [string, any]

export interface Command {
  startsWith: string
  tooltip: string
  requiredOptions?: string[]
  requiredParameters?: RequiredParameter[]
  execute: ({}: Dependencies) => (message: Message, params?: { [key: string]: any }) => Promise<void>
}