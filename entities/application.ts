import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";
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
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  public legalName!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public address: string;

  @Field()
  @Column()
  public email: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  public missionStatement!: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  public plannedProjects!: string;

  @Field((type) => ImpactLocation, {
    description: "Place of primary impact location of the organization?",
  })
  @ManyToOne(() => ImpactLocation)
  public primaryImpactLocation: ImpactLocation;

  @RelationId((application: Application) => application.primaryImpactLocation)
  public primaryImpactLocationId: number;

  @Field({ description: "How the organization plans to use the account" })
  @Column({ nullable: false })
  public accountUsagePlan!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public website: string;

  @Field(() => [String])
  @Column("varchar", { array: true, nullable: true })
  public socialMediaUrls: string[];

  @Field(() => [Category])
  @JoinTable()
  @ManyToMany(() => Category)
  public categories: Category[];

  @Field(() => OrganisationType, { nullable: true })
  @Column({ nullable: true })
  public organisationType?: OrganisationType;

  @Field(() => MainInterestReason, { nullable: true })
  @Column({ nullable: true })
  public mainInterestReason?: MainInterestReason;

  @Field(() => FundingType, {
    nullable: true,
    defaultValue: FundingType.single,
  })
  @Column({ default: FundingType.single })
  public fundingType?: FundingType;

  @Field({ nullable: false })
  @Column({ default: false })
  public acceptFundingFromCorporateSocialResponsibilityPartner: boolean;

  @Field({ nullable: false })
  @Column({ nullable: false })
  public plannedFunding!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.applications)
  public user: User;

  @Field(() => ApplicationState)
  @Column({nullable: false, default: ApplicationState.DRAFT})
  public applicationState: ApplicationState;
  
  @Field(() => ApplicationStep)
  @Column({nullable: false, default: ApplicationStep.STEP_1})
  public applicationStep: ApplicationStep;
}
