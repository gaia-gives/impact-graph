import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  BaseEntity,
} from "typeorm";
import { User } from "./user";
import { Project } from "./project";

@Entity()
@ObjectType()
export class Organisation extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descriptionHeadline?: string;

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
    this.raisedInTotal += amount;
  }

  updateTotalDonors() {
    const uniqueDonorUserIds: number[] = [];
    for (const project of this.projects) {
      for (const donation of project.donations) {
        if (!uniqueDonorUserIds.includes(donation.userId)) {
          uniqueDonorUserIds.push(donation.userId);
        }
      }
    }
    this.totalDonors = uniqueDonorUserIds.length;
  }

  @OneToMany((type) => Project, (project) => project.organisation)
  @JoinTable()
  @Field((type) => [Project], { defaultValue: [] })
  projects: Project[];

  @Field((type) => User)
  @ManyToMany((type) => User, (user) => user.organisations)
  @JoinTable()
  users: User[];
}
