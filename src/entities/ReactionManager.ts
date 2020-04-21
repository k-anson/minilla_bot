import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ReactionManager {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  message: string
}