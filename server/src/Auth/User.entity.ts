import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm"
import { Event } from "../Calendar/Event.entity"
import {SessionInvite} from "./Session.entity"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  age: number

  @OneToMany(type => Event, event => event.owner)
  events: Event[]

  @OneToMany(type => SessionInvite, invite => invite.user)
  sessionInvites: SessionInvite[]
}
