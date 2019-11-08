import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Event } from "./Event.entity";

@Entity()
export class EventTag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({type: "varchar", unique: true})
  name: string

  @ManyToMany(type => Event, event => event.tags)
  events: Promise<Event[]>

  @OneToMany(type => EventTagTranslation, translation => translation.tag, {
    cascade: true
  })
  translations: Promise<EventTagTranslation[]>
}

@Entity()
export class EventTagTranslation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => EventTag, tag => tag.translations, {
    nullable: false
  })
  tag: Promise<EventTag>

  @Column("varchar")
  language: string

  @Column("varchar")
  text: string
}
