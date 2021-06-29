import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  ColumnOptions,
} from "typeorm";
import { User } from "./user";
import { Project } from "./project";

@Entity()
@ObjectType()
export class Organisation {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mediaLink?: string;

  @Field({ nullable: false })
  @Column({ default: 0, nullable: false })
  totalDonors: number;

  @Field({ nullable: false })
  @Column({ default: 0, nullable: false })
  raisedInTotal: number;

  @ManyToMany((type) => Project)
  @JoinTable()
  @Field((type) => [Project], { nullable: true })
  projects: Project[];

  @Field((type) => User)
  @ManyToMany((type) => User, (user) => user.organisations)
  @JoinTable()
  users: User[];
}
