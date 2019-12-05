import {
  BaseEntity, BeforeInsert, BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../Auth/User.entity"
import { Event } from "../Calendar/Event.entity"

export enum EventRevisionConclusion {
  ACCEPT= "accept",
  REJECT="reject",
  REQUEST_CHANGES="request_changes",
  SPAM="spam"
}
@Entity()
export default class EventRevision extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(_ => User, user => user.eventRevisions)
  author: Promise<User>

  @ManyToOne(_ => Event, event => event.revisions)
  event: Promise<Event>

  @Column("varchar", {nullable: true})
  conclusion: EventRevisionConclusion

  @Column("timestamp")
  createdAt: Date

  @Column("timestamp")
  lastChangedAt: Date

  @Column("timestamp", {nullable: true})
  submittedAt: Date

  @ManyToOne(type => User, {nullable: true})
  dismissedBy: Promise<User>

  @Column("timestamp", {nullable: true})
  staleAt: Date

  @BeforeInsert()
  setCreatedAt() {
    const now = new Date()
    this.createdAt = now
    this.lastChangedAt = now
  }

  @BeforeUpdate()
  setLastChanged(){
    this.lastChangedAt = new Date()
  }

  async isActive() {
    return !(this.submittedAt || this.staleAt || (await this.dismissedBy)?.id)
  }
}
