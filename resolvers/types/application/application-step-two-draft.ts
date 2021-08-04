import { FileReference } from "./../../../entities/fileReference";
import { ArgsType, Field, ID, ObjectType } from "type-graphql";
import {
  Application,
  OrganisationNeededResources,
} from "../../../entities/application";

@ObjectType()
export class OrganisationalStructure {
  @Field({ nullable: true })
  public text?: string;

  @Field(() => [FileReference!], { nullable: true })
  public savedFiles?: FileReference[];
}

@ObjectType()
export class ValidationMaterial {
  @Field(() => [String!], { nullable: true })
  public links?: string[];

  @Field(() => [FileReference!], { nullable: true })
  public savedFiles?: FileReference[];
}

@ObjectType()
export class ApplicationStepTwoDraft {
  public static mapApplicationToDraft(
    application: Application
  ): ApplicationStepTwoDraft {
    return {
      id: application.id,
      validationMaterial: {
        links: application.validationMaterial,
        savedFiles: application.fileReferences.filter(
          (f) => f.mapsToField === "validationMaterial"
        ),
      },
      channelsAndStrategies: application.channelsAndStrategies,
      charter: application.fileReferences.find((f) => f.mapsToField === "charter"),
      currentChannelsOfFundraising: application.currentChannelsOfFundraising,
      document501c3: application.fileReferences.find(
        (f) => f.mapsToField === "document501c3"
      ),
      fullTimeWorkers: application.fullTimeWorkers,
      integrateDonations: application.integrateDonations,
      organisationNeededResources: application.organisationNeededResources,
      organisationalStructure: {
        savedFiles: application.fileReferences.filter(
          (f) => f.mapsToField === "organisationalStructure"
        ),
        text: application.organisationalStructure,
      },
      partnerOrganisations: application.partnerOrganisations,
      possibleAssistenceFromGaia: application.possibleAssistenceFromGaia,
      stakeholderCount: application.stakeholderCount,
    };
  }

  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => ValidationMaterial, { nullable: true })
  public validationMaterial?: ValidationMaterial;

  @Field(() => OrganisationalStructure, { nullable: true })
  public organisationalStructure?: OrganisationalStructure;

  @Field(() => FileReference, { nullable: true })
  public charter?: FileReference;

  @Field(() => FileReference, { nullable: true })
  public document501c3?: FileReference;

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
}

@ArgsType()
export class ApplicationStepTwoDraftVariables {
  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => [String!], { nullable: true })
  public validationMaterial?: string[];

  @Field(() => String, { nullable: true })
  public organisationalStructure?: string;

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
  public charter?: string;
}
