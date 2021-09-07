import { FundingGoal } from "../../../entities/application";
import { ArgsType, Field, ID, InputType, Int } from "type-graphql";
import {
  FundingType,
  MainInterestReason,
  OrganisationType,
} from "../../../entities/application";
import { SubmitGeneral, SubmitLinks } from ".";

@ArgsType()
@InputType()
export class ApplicationStepOneSubmitVariables {
  @Field(() => String)
  id: string;

  @Field(() => String)
  legalName: string;

  @Field(() => SubmitGeneral)
  general: SubmitGeneral;

  @Field(() => String)
  missionStatement: string;

  @Field(() => String)
  plannedProjects: string;

  @Field(() => String)
  accountUsagePlan: string;

  @Field(() => OrganisationType)
  organisationType: OrganisationType;

  @Field(() => String)
  primaryImpactLocation: string;

  @Field(() => FundingType)
  fundingType: FundingType;

  @Field(() => FundingGoal)
  plannedFunding: FundingGoal;

  @Field(() => Boolean)
  acceptFundingFromCorporateSocialResponsibilityPartner: boolean;

  @Field(() => MainInterestReason)
  mainInterestReason: MainInterestReason;

  @Field(() => [ID!])
  categoryIds: number[];

  @Field(() => SubmitLinks)
  links: SubmitLinks;
}
