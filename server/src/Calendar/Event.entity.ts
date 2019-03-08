import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  ManyToOne,
  CreateDateColumn
} from "typeorm"
import {User} from "../Auth/User.entity"

@Entity()
class EventLocation extends BaseEntity {

}

@Entity()
class EventContactPerson extends BaseEntity {

}

export class EventTime extends BaseEntity {
  @CreateDateColumn()
  timeZone: string
  @Column({type: "datetime"})
  start: Date
  @Column()
  end: Date
  @Column()
  recurrence: String
  @Column()
  exceptions: String
}

export class EventInformation {
  @Column()
  title: string
  @Column()
  description: string
}

@Entity()
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User, user => user.events)
  owner: User

  @Column(type => EventInformation)
  info: EventInformation

  @Column(type => EventTime)
  time: EventTime

  @Column()
  status: string

  @Column(type => EventContactPerson)
  contact: EventContactPerson[]

  @Column(type => EventLocation)
  location: EventLocation

}
