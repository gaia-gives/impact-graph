import { Field, ID, Float, ObjectType, Authorized, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  RelationId,
  JoinTable,
  BaseEntity,
  OneToMany,
} from "typeorm";

import { Organisation } from "./organisation";
import { Donation } from "./donation";
import { User } from "./user";
import { ProjectStatus } from "./projectStatus";
import { ImpactLocation } from "./impactLocation";
import { Milestone, MilestoneStatus } from "./milestone";
import { Category } from "./category";

@Entity()
@ObjectType()
class Project extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  admin?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  subHeadline?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  organisationId?: number;

  @Field((type) => Organisation)
  @ManyToOne((type) => Organisation)
  @JoinTable()
  organisation: Organisation;

  @Field({ nullable: true })
  @Column({ nullable: true })
  creationDate: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coOrdinates?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field((type) => [ImpactLocation], { nullable: true })
  @ManyToMany(
    (type) => ImpactLocation,
    (impactLocation) => impactLocation.projects,
    { nullable: true, eager: true, cascade: true }
  )
  @JoinTable()
  impactLocations: ImpactLocation[];

  @Field((type) => [Category], { nullable: true })
  @Column("enum", { enum: Category, array: true, default: [], nullable: false })
  categories: Category[];

  @Field((type) => Float, { nullable: true })
  @Column("float", { nullable: true })
  balance: number = 0;

  @Field({ nullable: true })
  @Column({ nullable: true })
  stripeAccountId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  walletAddress?: string;

  @Field((type) => Boolean)
  @Column()
  verified: boolean;

  @Field((type) => Boolean)
  @Column()
  giveBacks: boolean;

  @Field((type) => [Donation], { nullable: true })
  @OneToMany((type) => Donation, (donation) => donation.project)
  donations: Donation[];

  addDonation(args: AddDonationArgs) {
    // TODO: Setup donation correctly
    if (!this.donations) {
      this.donations = [];
    }
    this.donations.push({
      amount: args.amount,
      userId: args.userId,
      id: args.donationId,
    } as Donation);
    this.organisation.addDonation(args.amount);
    this.balance += args.amount;
    this.totalDonations++;
    this.updateTotalDonors();
    this.updateMilestones(args.amount);
  }

  private updateTotalDonors() {
    let donorIds: number[] = [];
    for (let donation of this.donations) {
      if (!donorIds.includes(donation.userId)) {
        donorIds.push(donation.userId);
      }
    }
    this.totalDonors = donorIds.length;
    this.organisation.updateTotalDonors();
  }

  private updateMilestones(amountDonated: number) {
    const activeMilestone = this.milestones.find(
      (milestone) => milestone.status === MilestoneStatus.active
    );
    if (activeMilestone) {
      const correctedAmount = this.getAmountWithoutSurplusAndSurplus(
        amountDonated,
        activeMilestone.threshold,
        activeMilestone.balance
      );
      const reached = activeMilestone.contributeToMilestone(
        correctedAmount.amountWithoutSurplus
      );
      if (reached) {
        const shouldBeActiveNext = this.milestones.find(
          (milestone) => milestone.status === MilestoneStatus.notReached
        );
        if (shouldBeActiveNext) {
          shouldBeActiveNext.setActive();
          this.donateToNextMilestoneIfAmountSurpassesCurrent(
            correctedAmount.surplus
          );
        }
      }
    }
  }

  private donateToNextMilestoneIfAmountSurpassesCurrent(surplus: number) {
    if (surplus > 0) {
      this.updateMilestones(surplus);
    }
  }

  private getAmountWithoutSurplusAndSurplus(
    amount: number,
    milestoneThreshold: number,
    milestoneBalance: number
  ): { amountWithoutSurplus: number; surplus: number } {
    if (amount > milestoneThreshold) {
      const surplus = amount - (milestoneThreshold - milestoneBalance);
      const amountWithoutSurplus = amount - surplus;
      return { amountWithoutSurplus, surplus };
    } else {
      return { amountWithoutSurplus: amount, surplus: 0 };
    }
  }

  @Field((type) => Float, { nullable: true })
  @Column({ nullable: true })
  qualityScore: number = 0;

  @ManyToMany((type) => User, (user) => user.projects, { eager: true })
  @JoinTable()
  @Field((type) => [User], { nullable: true })
  users: User[];

  @Field((type) => ProjectStatus)
  @ManyToOne((type) => ProjectStatus, { eager: true })
  status: ProjectStatus;

  @RelationId((project: Project) => project.status)
  statusId: number;

  mayUpdateStatus(user: User) {
    if (this.users.filter((o) => o.id === user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add / remove a heart to the score
   * @param loved true to add a heart, false to remove
   */
  updateQualityScoreHeart(loved: boolean) {
    if (loved) {
      this.qualityScore = this.qualityScore + 10;
    } else {
      this.qualityScore = this.qualityScore - 10;
    }
  }

  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  totalDonations: number = 0;

  @Field((type) => Int, { nullable: true })
  @Column({ default: 0 })
  totalDonors: number = 0;

  @Field((type) => Float, { nullable: true })
  @Column({ nullable: true })
  totalHearts: number = 0;

  @Field((type) => [Milestone], { defaultValue: [] })
  @OneToMany((type) => Milestone, (milestone) => milestone.project, {
    eager: true,
  })
  milestones: Milestone[];

  owner() {
    return this.users[0];
  }
}

interface AddDonationArgs {
  amount: number;
  userId: number;
  donationId: number;
}

@Entity()
@ObjectType()
class ProjectUpdate extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => String)
  @Column()
  title: string;

  @Field((type) => ID)
  @Column()
  projectId: number;

  @Field((type) => ID)
  @Column()
  userId: number;

  @Field((type) => String)
  @Column()
  content: string;

  @Field((type) => Date)
  @Column()
  createdAt: Date;

  @Field((type) => Boolean)
  @Column({ nullable: true })
  isMain: boolean;
}

export { Project, ProjectUpdate, AddDonationArgs };
