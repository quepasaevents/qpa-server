import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Event } from "../Calendar/Event.entity"

export enum ImageType {
  Cover = 'cover',
  Thumbnail = 'thumb',
  Gallery = 'gallery',
  Poster = 'poster'
}

@Entity()
export class EventImage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({ type: "varchar" })
  type: ImageType

  @Column({type: "varchar", unique: true})
  url: string

  @ManyToOne(type => Event, event => event.images, {
    cascade: true,
  })
  event: Promise<Event>
}
