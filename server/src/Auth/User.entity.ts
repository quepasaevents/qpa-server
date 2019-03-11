import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany, JoinColumn
} from "typeorm"
import { Event } from "../Calendar/Event.entity"
import {SessionInvite} from "./Session.entity"

@Entity("app_user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  email: string

  @JoinColumn()
  @OneToMany(type => Event, event => event.owner)
  events: Event[]

  @JoinColumn()
  @OneToMany(type => SessionInvite, invite => invite.user)
  sessionInvites: SessionInvite[]
}
