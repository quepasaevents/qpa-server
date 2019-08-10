import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany, CreateDateColumn
} from "typeorm"
import { Event } from "../Calendar/Event.entity"
import {Session, SessionInvite} from "./Session.entity"
import UserRole from "./UserRole.entity";

@Entity("app_user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({nullable: true})
  username: string

  @Column({ unique: true })
  email: string

  @OneToMany(type => Event, event => event.owner)
  events: Promise<Event[]>

  @OneToMany(type => Session, session => session.user)
  sessions: Promise<Session[]>

  @OneToMany(type => SessionInvite, invite => invite.user)
  sessionInvites: Promise<SessionInvite[]>

  @CreateDateColumn()
  created: Date

  @OneToMany(() => UserRole, role => role.user)
  roles: Promise<UserRole[]>
}
