import { FileReference } from "./fileReference";
import { registerEnumType, ObjectType, Field, ID } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";

export enum ApplicationState {
  INITIAL = "INITIAL",
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

export enum FundingGoal {
  xs = "xs",
  s = "s",
  m = "m",
  l = "l",
}
registerEnumType(FundingGoal, {
  name: "FundingGoal",
  description: "How much do you plan to collect for your project?",
});

export enum OrganisationNeededResources {
  projectAdviceAndCoaching = "projectAdviceAndCoaching",
  financialConsultingAndBusinessModelGeneration = "financialConsultingAndBusinessModelGeneration",
  mediaSupport = "mediaSupport",
  leadershipDevelopment = "leadershipDevelopment"
}
registerEnumType(OrganisationNeededResources, {
  name: "OrganisationNeededResources",
  description: "The topic the organisation needs support for",
});

@ObjectType()
@Entity()
export class Application extends BaseEntity {

  public assertCanSubmit(step: ApplicationStep): void {
    const canSubmit = this.applicationState !== ApplicationState.PENDING &&
    this.applicationState !== ApplicationState.REJECTED &&
    this.applicationState !== ApplicationState.ACCEPTED && this.applicationStep === step;
    if (!canSubmit) throw new Error("Cannot submit, invalid application state for submission");
  }

  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public legalName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postcode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactPerson?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public missionStatement?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public plannedProjects?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public primaryImpactLocation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public accountUsagePlan?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public website: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public facebook: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public instagram: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public other: string;

  @Field(() => [Category])
  @JoinTable()
  @ManyToMany(() => Category, { cascade: true })
  public categories: Category[];

  @Field(() => OrganisationType, { nullable: true })
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
  public acceptFundingFromCorporateSocialResponsibilityPartner?: boolean;

  @Field(() => FundingGoal, { nullable: true })
  @Column({ nullable: true })
  public plannedFunding?: FundingGoal;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.applications, { cascade: true })
  public user: User;

  @Column({ nullable: true })
  @RelationId((application: Application) => application.user)
  public userId?: number;

  @Field(() => ApplicationState, { nullable: true })
  @Column({ nullable: false, default: ApplicationState.INITIAL })
  public applicationState: ApplicationState;

  @Field(() => ApplicationStep, { nullable: true })
  @Column({ nullable: false, default: ApplicationStep.STEP_1 })
  public applicationStep: ApplicationStep;

  @Field(() => [String!], { nullable: true })
  @Column("varchar", { array: true, nullable: true, default: [] })
  public validationMaterial: string[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  public organisationalStructure: string;

  @Field(() => [FileReference!], { nullable: true })
  @OneToMany(
    () => FileReference,
    (fileReference) => fileReference.application,
    { cascade: true }
  )
  public fileReferences: FileReference[];

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({  nullable: true, type: "timestamptz" })
  @UpdateDateColumn({ nullable: true, type: "timestamptz" })
  public lastEdited?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public currentChannelsOfFundraising?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public channelsAndStrategies?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  public integrateDonations?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public partnerOrganisations?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public fullTimeWorkers?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public stakeholderCount?: string;

  @Field(() => OrganisationNeededResources, { nullable: true })
  @Column({ nullable: true })
  public organisationNeededResources?: OrganisationNeededResources;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public possibleAssistenceFromGaia?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public firstProjectImpactsAppropriateness?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public firstProjectBeneficiaries?: string;  

  @Field({ nullable: true })
  @Column({ nullable: true })
  public firstProjectStakeholderRepresentation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public firstProjectRisks?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public firstProjectMilestoneValidation?: string;
}
