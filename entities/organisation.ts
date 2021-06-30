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
  @Column({ type: "real", default: 0, nullable: false })
  raisedInTotal: number;

  addDonation(amount: number) {
    if (amount <= 0) {
      throw new Error("Cannot add 0 or less than 0 donation amount");
    }
    this.totalDonors++;
    this.raisedInTotal += amount;
  }

  @OneToMany((type) => Project, (project) => project.organisation)
  @JoinTable()
  @Field((type) => [Project], { nullable: true })
  projects: Project[];

  @Field((type) => User)
  @ManyToMany((type) => User, (user) => user.organisations)
  @JoinTable()
  users: User[];
}
