import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany, JoinColumn, CreateDateColumn
} from "typeorm"
import { Event } from "../Calendar/Event.entity"
import {Session, SessionInvite} from "./Session.entity"

@Entity("app_user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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

  @OneToMany(type => Session, session => session.user)
  sessions: Session[]

  @OneToMany(type => SessionInvite, invite => invite.user)
  sessionInvites: SessionInvite[]

  @CreateDateColumn()
  created: Date
}
