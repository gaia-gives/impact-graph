import { ArgsType, Field, ID, InputType } from "type-graphql";
import { OrganisationNeededResources } from "../../../entities/application";
import { File, ValidationMaterial, OrganisationalStructure } from ".";

@ArgsType()
@InputType()
export class ApplicationStepTwoDraftVariables {
  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => ValidationMaterial, { nullable: true })
  public validationMaterial?: ValidationMaterial;

  @Field(() => OrganisationalStructure, { nullable: true })
  public organisationalStructure?: OrganisationalStructure;

  @Field(() => [File!], { nullable: true })
  public document501c3?: File[];

  @Field(() => [File], { nullable: true })
  public charter?: File[];

  @Field({ nullable: true })
  public currentChannelsOfFundraising?: string;

  @Field({ nullable: true })
  public channelsAndStrategies?: string;

  @Field(() => Boolean, { nullable: true })
  public integrateDonations?: boolean;

  @Field({ nullable: true })
  public partnerOrganisations?: string;

  @Field({ nullable: true })
  public fullTimeWorkers?: string;

  @Field({ nullable: true })
  public stakeholderCount?: string;

  @Field(() => OrganisationNeededResources, { nullable: true })
  public organisationNeededResources?: OrganisationNeededResources;

  @Field({ nullable: true })
  public possibleAssistenceFromGaia?: string;

  @Field({ nullable: true })
  public firstProjectImpactsAppropriateness?: string;

  @Field({ nullable: true })
  public firstProjectBeneficiaries?: string;

  @Field({ nullable: true })
  public firstProjectStakeholderRepresentation?: string;

  @Field({ nullable: true })
  public firstProjectRisks?: string;

  @Field({ nullable: true })
  public firstProjectMilestoneValidation?: string;
}
