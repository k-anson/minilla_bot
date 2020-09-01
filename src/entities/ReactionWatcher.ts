import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'

import { ReactionWatcherAction } from './ReactionWatcherAction'

@Entity()
export class ReactionWatcher {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  messageId: string

  @Column()
  emojiName: string

  @OneToOne(type => ReactionWatcherAction, reactionWatcherAction => reactionWatcherAction.reactionWatcher, {
    eager: true
  })
  reactionWatcherAction: ReactionWatcherAction
}