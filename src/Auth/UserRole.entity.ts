import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User.entity";

export type RoleType = "admin" | "embassador" | "organizer";

@Entity()
export default class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: RoleType;

  @ManyToOne(() => User, user => user.roles)
  user: Promise<User>;
}
