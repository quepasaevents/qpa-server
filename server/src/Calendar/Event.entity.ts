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

class Contact {
  @Column()
  email?: string

  @Column()
  phone?: string
}

@Entity()
class EventContactPerson {
  @Column()
  name: string

  // todo: check pg support for arrays
  // @Column({type: "array"})
  // languages: string[]

  @Column()
  contact: Contact
}

export class EventTime {
  @CreateDateColumn()
  timeZone: string
  @Column({type: "time"})
  start: Date
  @Column({type: "time"})
  end: Date
  @Column({nullable: true})
  recurrence?: String
  @Column({nullable: true})
  exceptions?: String
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

  // todo: check pg support for arrays
  // @Column(type => EventContactPerson)
  // contact: EventContactPerson[]

  @Column(type => EventLocation)
  location: EventLocation

}
