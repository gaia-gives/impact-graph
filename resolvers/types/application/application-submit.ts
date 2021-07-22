import { ArgsType, Field, ID, ObjectType, Int } from "type-graphql";
import { ApplicationState, ApplicationStep, FundingType, MainInterestReason, OrganisationType } from "../../../entities/application";
import { Category } from "../../../entities/category";
import { ImpactLocation } from "../../../entities/impactLocation";
import { User } from "../../../entities/user";

@ArgsType()
export class ApplicationSubmit  {
  @Field(() => ID)
  public id!: string;

  @Field({ nullable: false })
  public legalName!: string;

  @Field({ nullable: true })
  public address: string;

  @Field()
  public email: string;

  @Field({ nullable: false })
  public missionStatement!: string;

  @Field({ nullable: false })
  public plannedProjects!: string;

  @Field((type) => Int!, {
    description: "Place of primary impact location of the organization?",
  })
  public primaryImpactLocationId: number;

  @Field({ description: "How the organization plans to use the account" })
  public accountUsagePlan!: string;

  @Field({ nullable: true })
  public website: string;

  @Field(() => [String])
  public socialMediaUrls: string[];

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

  @Field({ nullable: false })
  public plannedFunding!: number;

  @Field(() => ApplicationState)
  public applicationState: ApplicationState;
  
  @Field(() => ApplicationStep)
  public applicationStep: ApplicationStep;
}
