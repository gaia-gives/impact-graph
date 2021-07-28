import { FundingGoal } from "./../../../entities/application";
import { ArgsType, Field, ID, Int } from "type-graphql";
import {
  ApplicationState,
  ApplicationStep,
  FundingType,
  MainInterestReason,
  OrganisationType,
} from "../../../entities/application";

@ArgsType()
export class ApplicationSubmit {
  @Field(() => String)
  public id!: string;

  @Field({ nullable: false })
  public legalName!: string;

  @Field({ nullable: false })
  public address: string;

  @Field({ nullable: false })
  public city: string;

  @Field({ nullable: false })
  public postcode: string;

  @Field({ nullable: false })
  public country: string;

  @Field({ nullable: false })
  public contactPerson: string;

  @Field({ nullable: false })
  public email: string;

  @Field({ nullable: false })
  public missionStatement!: string;

  @Field({ nullable: false })
  public plannedProjects!: string;

  @Field((type) => String!, {
    description: "Place of primary impact location of the organization?",
  })
  public primaryImpactLocation: string;

  @Field({ description: "How the organization plans to use the account" })
  public accountUsagePlan!: string;

  @Field({ nullable: true })
  public website: string;

  @Field({ nullable: true })
  public facebook?: string;

  @Field({ nullable: true })
  public instagram?: string;

  @Field({ nullable: true })
  public other?: string;

  @Field(() => [Int!]!, { nullable: true })
  public categoryIds: number[];

  @Field(() => OrganisationType, { nullable: true })
  public organisationType?: OrganisationType;

  @Field(() => MainInterestReason, { nullable: true })
  public mainInterestReason?: MainInterestReason;

  @Field(() => FundingType, {
    nullable: true,
    defaultValue: FundingType.single,
  })
  public fundingType?: FundingType;

  @Field({ nullable: false })
  public acceptFundingFromCorporateSocialResponsibilityPartner: boolean;

  @Field(() => FundingGoal, { nullable: false })
  public plannedFunding!: FundingGoal;

  @Field(() => ApplicationState)
  public applicationState: ApplicationState;

  @Field(() => ApplicationStep)
  public applicationStep: ApplicationStep;

  @Field(() => [String!], { nullable: true })
  public validationMaterials: string[];
}
