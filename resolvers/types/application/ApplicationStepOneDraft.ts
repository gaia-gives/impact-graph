import { FundingGoal } from "../../../entities/application";
import { Field, ID, Int, ArgsType, Float, InputType } from "type-graphql";
import {
  FundingType,
  MainInterestReason,
  OrganisationType,
} from "../../../entities/application";
import { General, Links } from ".";

@ArgsType()
@InputType()
export class ApplicationStepOneDraftVariables  {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  legalName?: string;

  @Field(() => General, { nullable: true })
  general?: General;

  @Field(() => String, { nullable: true })
  missionStatement?: string;

  @Field(() => String, { nullable: true })
  plannedProjects?: string;

  @Field(() => String, { nullable: true })
  accountUsagePlan?: string;

  @Field(() => OrganisationType, { nullable: true })
  organisationType?: OrganisationType;

  @Field(() => String, { nullable: true })
  primaryImpactLocation?: string;

  @Field(() => FundingType, { nullable: true })
  fundingType?: FundingType;

  @Field(() => FundingGoal, { nullable: true })
  plannedFunding?: FundingGoal;

  @Field(() => Boolean, { nullable: true })
  acceptFundingFromCorporateSocialResponsibilityPartner?: boolean;

  @Field(() => MainInterestReason, { nullable: true })
  mainInterestReason?: MainInterestReason;

  @Field(() => [Number], {nullable: true})
  categoryIds?: number[];

  @Field(() => Links, { nullable: true })
  links?: Links;
}
