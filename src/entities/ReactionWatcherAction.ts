import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'

import { ReactionWatcher } from './ReactionWatcher'

export type ReactionWatcherActionType = 'role' | 'channel' | 'custom'

@Entity()
export class ReactionWatcherAction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: ['role', 'channel']
  })
  type: ReactionWatcherActionType

  @Column()
  value: string

  @Column()
  toggle: boolean

  @OneToOne(type => ReactionWatcher, reactionWatcher => reactionWatcher.reactionWatcherAction)
  @JoinColumn()
  reactionWatcher: ReactionWatcher
}