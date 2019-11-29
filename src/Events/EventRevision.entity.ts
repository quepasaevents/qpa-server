import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "../Auth/User.entity"
import { Event } from "../Calendar/Event.entity"

@Entity()
export default class EventRevision extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(_ => User, user => user.eventRevisions)
  author: Promise<User>

  @ManyToOne(_ => Event, event => event.revisions)
  event: Promise<Event>

  @Column("boolean")
  accepting: boolean

  @Column("boolean")
  denying: boolean

  @Column("boolean")
  spam: boolean

  @Column("varchar")
  comment: string

  @Column("timestamp")
  createdAt: Date

  @Column("timestamp")
  submittedAt: Date

  @ManyToOne(type => User)
  dismissedBy: Promise<User>

  @Column("timestamp")
  staleAt: Date

  async isActive() {
    return !(this.submittedAt || this.staleAt || (await this.dismissedBy).id)
  }
}
