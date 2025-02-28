import { Field, ID, ObjectType } from "type-graphql";
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  BaseEntity,
  JoinTable,
} from "typeorm";
import { Organisation } from "./organisation";
import { Project } from "./project";
import { Application } from "./application";

export enum GlobalRole {
  ADMIN = "admin",
  USER = "user",
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  newEmail?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  walletAddress?: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Column()
  loginType: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field()
  @Column({ type: "enum", enum: GlobalRole, default: GlobalRole.USER })
  globalRole: GlobalRole;

  @Field((type) => [Organisation])
  @ManyToMany((type) => Organisation, (organisation) => organisation.users)
  organisations: Organisation[];

  @Field((type) => Project)
  @ManyToMany((type) => Project, (project) => project.users)
  @JoinTable()
  projects?: Project[];

  @Column("bool", { default: false })
  segmentIdentified: boolean;

  segmentUserId() {
    return `givethId-${this.id}`;
  }

  @Field(() => [Application])
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}
