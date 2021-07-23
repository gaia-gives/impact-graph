import { registerEnumType, ObjectType, Field, Float, ID, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Category } from "./category";
import { ImpactLocation } from "./impactLocation";
import { User } from "./user";

export enum ApplicationState {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
registerEnumType(ApplicationState, {
  name: "ApplicationState",
});

export enum ApplicationStep {
  STEP_1 = "STEP_1",
  STEP_2 = "STEP_2",
}

registerEnumType(ApplicationStep, {
  name: "ApplicationStep",
});

export enum OrganisationType {
  registeredNonProfit = "registeredNonProfit",
  socialEnterprise = "socialEnterprise",
  informalInitiative = "informalInitiative",
}
registerEnumType(OrganisationType, {
  name: "OrganisationType",
  description: "The type of the organization",
});

export enum MainInterestReason {
  fundraising = "fundraising",
  enhancedMarketingCollateral = "enhancedMarketingCollateral",
  matchFunding = "matchFunding",
  donorTransparency = "donorTransparency",
}
registerEnumType(MainInterestReason, {
  name: "MainInterestReason",
  description: "In what the organization is interested",
});

export enum FundingType {
  ongoing = "ongoing",
  single = "single",
}
registerEnumType(FundingType, {
  name: "FundingType",
  description: "What is the main funding method used by the organization",
});

@ObjectType()
@Entity()
export class Application extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public legalName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public missionStatement: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public plannedProjects: string;

  @Field(() => ImpactLocation, { nullable: true })
  @ManyToOne(() => ImpactLocation, { cascade: true })
  public primaryImpactLocation: ImpactLocation;
  
  @Column({ nullable: true })
  @RelationId("primaryImpactLocation")
  public primaryImpactLocationId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public accountUsagePlan: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public website: string;

  @Field(() => [String], { nullable: true })
  @Column("varchar", { array: true, nullable: true })
  public socialMediaUrls: string[];

  @Field(() => [Category])
  @JoinTable()
  @ManyToMany(() => Category, { cascade: true })
  public categories: Category[];

  @Field(() => OrganisationType)
  @Column({ nullable: true })
  public organisationType?: OrganisationType;

  @Field(() => MainInterestReason, { nullable: true })
  @Column({ nullable: true })
  public mainInterestReason?: MainInterestReason;

  @Field(() => FundingType, { nullable: true })
  @Column({ nullable: true })
  public fundingType?: FundingType;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  public acceptFundingFromCorporateSocialResponsibilityPartner: boolean;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true })
  public plannedFunding!: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.applications, { cascade: true })
  public user: User;

  @Column({ nullable: true })
  @RelationId((application: Application) => application.user)
  public userId: number;

  @Field(() => ApplicationState, { nullable: true })
  @Column({ nullable: false, default: ApplicationState.DRAFT })
  public applicationState: ApplicationState;

  @Field(() => ApplicationStep, { nullable: true })
  @Column({ nullable: false, default: ApplicationStep.STEP_1 })
  public applicationStep: ApplicationStep;
}
