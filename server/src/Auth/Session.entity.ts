import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm'
import {User} from "./User.entity"
import * as uuid4 from 'uuid/v4'

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @JoinColumn()
  @ManyToOne(type => User, (user: User) => user.sessionInvites)
  user: User

  @Column()
  isValid: boolean

  @Column()
  hash: string
}


@Entity()
export class SessionInvite extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: string

  @JoinColumn()
  @ManyToOne(type => User, (user: User) => user.sessionInvites)
  user: User

  @Column()
  hash: string

  @Column({nullable: true})
  timeValidated?: Date

}
