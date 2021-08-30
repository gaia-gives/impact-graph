import { IApplicationStepTwo } from './../../../entities/application';
import { FileReference } from "./../../../entities/fileReference";
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";
import {
  Application,
  ApplicationState,
  ApplicationStep,
  OrganisationNeededResources,
} from "../../../entities/application";
import { DeepPartial } from "typeorm";

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
export class ApplicationStepTwoDraft implements Omit<IApplicationStepTwo, "validationMaterial" | "organisationalStructure"> {
  public static mapApplicationToDraft(
    application: Application
  ): ApplicationStepTwoDraft {
    return {
      id: application.id,
      validationMaterial: {
        links: application.validationMaterial,
        savedFiles: application.fileReferences?.filter(
          (f) => f.mapsToField === "validationMaterial" ?? []
        ),
      },
      channelsAndStrategies: application.channelsAndStrategies,
      charter: application.fileReferences.filter((f) => f.mapsToField === "charter") ?? [],
      currentChannelsOfFundraising: application.currentChannelsOfFundraising,
      document501c3: application.fileReferences.filter(
        (f) => f.mapsToField === "document501c3"
      ),
      fullTimeWorkers: application.fullTimeWorkers,
      integrateDonations: application.integrateDonations,
      organisationNeededResources: application.organisationNeededResources,
      organisationalStructure: {
        savedFiles: application.fileReferences?.filter(
          (f) => f.mapsToField === "organisationalStructure" ?? []
        ),
        text: application.organisationalStructure,
      },
      partnerOrganisations: application.partnerOrganisations,
      possibleAssistenceFromGaia: application.possibleAssistenceFromGaia,
      stakeholderCount: application.stakeholderCount,
      firstProjectBeneficiaries:application.firstProjectBeneficiaries,
      firstProjectImpactsAppropriateness: application.firstProjectImpactsAppropriateness,
      firstProjectMilestoneValidation: application.firstProjectMilestoneValidation,
      firstProjectRisks: application.firstProjectRisks,
      firstProjectStakeholderRepresentation: application.firstProjectStakeholderRepresentation,
      applicationState: application.applicationState,
      applicationStep: application.applicationStep,
      lastEdited: application.lastEdited
    };
  }

  public static mapDraftToApplication(draft: ApplicationStepTwoDraft): DeepPartial<Application> {
    return {
      ...draft,
      validationMaterial: draft.validationMaterial?.links,
      organisationalStructure: draft.organisationalStructure?.text
    };
  }

  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => ValidationMaterial, { nullable: true })
  public validationMaterial?: ValidationMaterial;

  @Field(() => OrganisationalStructure, { nullable: true })
  public organisationalStructure?: OrganisationalStructure;

  @Field(() => [FileReference!], { nullable: true })
  public charter?: FileReference[];

  @Field(() => [FileReference!], { nullable: true })
  public document501c3?: FileReference[];

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

  @Field({ nullable: true })
  public applicationState: ApplicationState;
  
  @Field({ nullable: true })
  public applicationStep: ApplicationStep;

  @Field(() => Date, { nullable: true})
  public lastEdited?: Date;
}

@ArgsType()
@InputType()
export class ApplicationStepTwoDraftVariables implements IApplicationStepTwo {
  @Field(() => ID!, { nullable: false })
  public id: string;

  @Field(() => [String!], { nullable: true })
  public validationMaterial?: string[];

  @Field({ nullable: true })
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
