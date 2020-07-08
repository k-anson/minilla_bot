import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ReactionWatcher {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  messageId: string

  @Column()
  emoji: string
}