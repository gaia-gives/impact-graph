import { FundingGoal, IApplicationStepOne } from "../../../entities/application";
import { Field, ID, Int, ArgsType, Float } from "type-graphql";
import {
  FundingType,
  MainInterestReason,
  OrganisationType,
} from "../../../entities/application";

@ArgsType()
export class ApplicationStepOneDraft implements IApplicationStepOne {
  @Field(() => String, { nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public legalName?: string;

  @Field({ nullable: true })
  public address?: string;

  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postcode?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  contactPerson?: string;

  @Field({ nullable: true })
  public missionStatement?: string;

  @Field({ nullable: true })
  public plannedProjects?: string;

  @Field({
    description: "Place of primary impact location of the organization?",
    nullable: true,
  })
  public primaryImpactLocation?: string;

  @Field({
    description: "How the organization plans to use the account",
    nullable: true,
  })
  public accountUsagePlan?: string;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true })
  public facebook?: string;

  @Field({ nullable: true })
  public instagram?: string;

  @Field({ nullable: true })
  public other?: string;

  @Field(() => [Int!], { nullable: true })
  public categoryIds?: number[];

  @Field(() => OrganisationType, { nullable: true })
  public organisationType?: OrganisationType;

  @Field(() => MainInterestReason, { nullable: true })
  public mainInterestReason?: MainInterestReason;

  @Field(() => FundingType, {
    nullable: true,
    defaultValue: FundingType.single,
  })
  public fundingType?: FundingType;

  @Field({ nullable: true })
  public acceptFundingFromCorporateSocialResponsibilityPartner?: boolean;

  @Field(() => FundingGoal, { nullable: true })
  public plannedFunding: FundingGoal;

  @Field({nullable: true})
  public adminComment?: string;
}
