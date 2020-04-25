import Discord from 'discord.js'
import EZ from 'eznv'
import path from 'path'

import schema from './config'

import createClient from './createClient'

declare global {
  interface Dependencies {
    config: EZ.LoadType<typeof schema>
  }
}

let client: Discord.Client

async function main () {
  // Grab dependencies
  const config = await schema.load({
    cwd: path.join(__dirname, '..')
  })
  // const database = await loadDatabase()

  client = await createClient({ config })
}

process.on('SIGINT', async function () {
  console.log('Caught interruption signal')
  console.log('Destroying Client')
  if (client) await client.destroy()
  process.exit(0)
})

main().catch(async err => {
  console.error(err)
  console.log('Destroying Client')
  if (client) await client.destroy()
})