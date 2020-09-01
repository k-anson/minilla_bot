import EZ from 'eznv'
import { createConnection, Connection, Repository } from 'typeorm'

import schema from './config'
import { ReactionWatcher } from './entities/ReactionWatcher'
import { ReactionWatcherAction } from './entities/ReactionWatcherAction'

export interface Database {
  connection: Connection
  reactionWatcherRepository: Repository<ReactionWatcher>
  reactionWatcherActionRepository: Repository<ReactionWatcherAction>
}

export async function loadDatabase (config: EZ.LoadType<typeof schema>): Promise<Database> {
  const connection = await createConnection({
    type: 'mysql',
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USERNAME,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    entities: [
      'src/entities/**/*.ts'
    ],
    synchronize: true
  })

  return {
    connection,
    reactionWatcherRepository: connection.getRepository(ReactionWatcher),
    reactionWatcherActionRepository: connection.getRepository(ReactionWatcherAction)
  }
}