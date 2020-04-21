import Discord from 'discord.js'

import createClient from './createClient'

declare global {
  interface Dependencies {}
}

let client: Discord.Client

async function main () {
  // Grab dependencies
  // const database = await loadDatabase()

  client = await createClient()
}

process.on('SIGINT', async function () {
  console.log('Caught interruption signal')
  console.log('Destroying client')
  if (client) await client.destroy()
  process.exit(0)
})

main().catch(async err => {
  console.error(err)
  console.log('destroying client')
  if (client) await client.destroy()
})