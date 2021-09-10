import { ArgsType, Field, ID, InputType } from "type-graphql";
import { OrganisationNeededResources } from "../../../entities/application";
import {
  File,
  SubmitValidationMaterial,
  SubmitOrganisationalStructure,
} from ".";

@ArgsType()
@InputType()
export class ApplicationStepTwoSubmitVariables {
  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => SubmitValidationMaterial)
  public validationMaterial: SubmitValidationMaterial;

  @Field(() => SubmitOrganisationalStructure)
  public organisationalStructure: SubmitOrganisationalStructure;

  @Field(() => [File!])
  public charter: File[];

  @Field(() => [File!])
  public document501c3: File[];

  @Field()
  public currentChannelsOfFundraising: string;

  @Field()
  public channelsAndStrategies: string;

  @Field(() => Boolean)
  public integrateDonations: boolean;

  @Field()
  public partnerOrganisations: string;

  @Field()
  public fullTimeWorkers: string;

  @Field()
  public stakeholderCount: string;

  @Field(() => OrganisationNeededResources)
  public organisationNeededResources: OrganisationNeededResources;

  @Field()
  public possibleAssistenceFromGaia: string;

  @Field()
  public firstProjectImpactsAppropriateness: string;

  @Field()
  public firstProjectBeneficiaries: string;

  @Field()
  public firstProjectStakeholderRepresentation: string;

  @Field()
  public firstProjectRisks: string;

  @Field()
  public firstProjectMilestoneValidation: string;
}
