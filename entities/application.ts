import {
  registerEnumType,
  ObjectType,
  Field,
  ID,
  Authorized,
  Int,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import {
  File,
  OrganisationalStructure,
  ValidationMaterial,
  General,
  Links,
} from "../resolvers/types/application";
import { User } from "./user";
import { Organisation } from "./organisation";

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
  leadershipDevelopment = "leadershipDevelopment",
}
registerEnumType(OrganisationNeededResources, {
  name: "OrganisationNeededResources",
  description: "The topic the organisation needs support for",
});

@ObjectType()
@Entity()
export class Application extends BaseEntity {
  public assertCanSubmit(step: ApplicationStep): void {
    const canSubmit =
      this.applicationState !== ApplicationState.PENDING &&
      this.applicationState !== ApplicationState.REJECTED &&
      this.applicationState !== ApplicationState.ACCEPTED &&
      this.applicationStep === step;
    if (!canSubmit)
      throw new Error(
        "Cannot submit, invalid application state for submission!"
      );
  }

  public assertCanUpdate(step: ApplicationStep): void {
    const canUpdate =
      this.applicationState !== ApplicationState.PENDING &&
      this.applicationState !== ApplicationState.REJECTED &&
      this.applicationState !== ApplicationState.ACCEPTED &&
      this.applicationStep === step;
    if (!canUpdate) {
      throw new Error("Cannot update, invalid application state for update!");
    }
  }

  public setRead() {
    this.readByAdmin = true;
  }

  public setSubmitted(step: ApplicationStep) {
    this.assertCanSubmit(step);
    this.applicationState = ApplicationState.PENDING;
  }

  public createOrganisationThroughApproval(): Organisation {
    if (this.applicationStep !== ApplicationStep.STEP_2 || this.applicationState !== ApplicationState.ACCEPTED) {
      throw new Error("Cannot create organisation without beforehand approval!");
    }
    const organisation = new Organisation(); 

    organisation.title = this.legalName!;
    organisation.users = [];
    organisation.users.push(this.user);
    return organisation;
  }

  public async updateAdminComment(comment: string) {
    if (this.applicationStep === ApplicationStep.STEP_1) {
      this.adminCommentStepOne = comment;
    } else {
      this.adminCommentStepTwo = comment;
    }
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public legalName?: string;

  @Field(() => General, { nullable: true })
  @Column("simple-json", { nullable: true })
  public general?: General;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public missionStatement?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public plannedProjects?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public accountUsagePlan?: string;

  @Field(() => OrganisationType, { nullable: true })
  @Column("enum", { enum: OrganisationType, nullable: true })
  public organisationType?: OrganisationType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public primaryImpactLocation?: string;

  @Field(() => FundingType, { nullable: true })
  @Column({ nullable: true })
  public fundingType?: FundingType;

  @Field(() => FundingGoal, { nullable: true })
  @Column("enum", { enum: FundingGoal, nullable: true })
  public plannedFunding?: FundingGoal;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  public acceptFundingFromCorporateSocialResponsibilityPartner?: boolean;

  @Field(() => MainInterestReason, { nullable: true })
  @Column("enum", { enum: MainInterestReason, nullable: true })
  public mainInterestReason?: MainInterestReason;

  @Field(() => [Category])
  @Column("enum", { enum: Category, array: true, default: [], nullable: false })
  public categories: Category[];

  @Field(() => Links, { nullable: true })
  @Column("simple-json", { nullable: true })
  public links: Links;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.applications, { cascade: true })
  public user: User;

  @Column({ nullable: true })
  @RelationId((application: Application) => application.user)
  public userId?: number;

  @Field(() => ApplicationState, { nullable: true })
  @Column("enum", {
    enum: ApplicationState,
    nullable: false,
    default: ApplicationState.INITIAL,
  })
  public applicationState: ApplicationState;

  @Field(() => ApplicationStep, { nullable: true })
  @Column("enum", {
    enum: ApplicationStep,
    nullable: false,
    default: ApplicationStep.STEP_1,
  })
  public applicationStep: ApplicationStep;

  @Field(() => [File!], { nullable: true })
  @Column("simple-json", { nullable: false, default: [] })
  public charter?: File[];

  @Field(() => [File!], { nullable: true })
  @Column("simple-json", { nullable: false, default: [] })
  public document501c3?: File[];

  @Field(() => ValidationMaterial, { nullable: true })
  @Column("simple-json", { nullable: true, default: { links: [], files: [] } })
  public validationMaterial?: ValidationMaterial;

  @Field(() => OrganisationalStructure, { nullable: true })
  @Column("simple-json", { nullable: true, default: { text: null, files: [] } })
  public organisationalStructure?: OrganisationalStructure;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ nullable: true, type: "timestamptz" })
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
  @Column("enum", { enum: OrganisationNeededResources, nullable: true })
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

  @Field(() => Boolean, { nullable: true })
  @Authorized("admin")
  @Column({ nullable: true, default: false })
  public readByAdmin?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public adminCommentStepOne?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public adminCommentStepTwo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public organisationId?: number;
}
