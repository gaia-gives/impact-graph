import { ApplicationStepTwoDraftVariables } from './../types/application/ApplicationStepTwoDraft';
import { UPDATE_APPLICATION_STEP_ONE_DRAFT_MUTATION } from "./queries-and-mutations/application/updateApplicationStepOneDraftMutation";
import {
  SUBMIT_APPLICATION_STEP_TWO_MUTATION,
  UPDATE_APPLICATION_STEP_TWO_DRAFT_MUTATION,
} from "./queries-and-mutations";
import {
  OrganisationType,
  MainInterestReason,
  FundingType,
  ApplicationState,
  ApplicationStep,
  FundingGoal,
  Application,
  OrganisationNeededResources,
} from "../../entities/application";
import { ApolloServer } from "apollo-server-express";
import "mocha";
import { expect } from "chai";
import { createTestServer } from "../../server/testServerFactory";
import {
  APPLICATION_QUERY,
  CREATE_APPLICATION_MUTATION,
  SUBMIT_APPLICATION_STEP_ONE_MUTATION,
} from "./queries-and-mutations";
import * as TypeORM from "typeorm";
import path from "path";
import {
  ApplicationStepOneDraftVariables,
  ApplicationStepOneSubmitVariables,
  ApplicationStepTwoSubmitVariables,
} from "../types/application";

let server: ApolloServer;
let connection: TypeORM.Connection;
let application: Application;


describe("application resolver", async () => {
  const createApplicationDraft: () => Promise<Application> = async () => {
    await connection.query(`INSERT INTO "application" ("legalName") VALUES ('TEST')`);
    const result = await connection.query(`SELECT * FROM "application" WHERE "legalName" = 'TEST'`);
    return result[0] as Application;
  };

  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
    application = await createApplicationDraft();
  });

  after(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query application draft", async () => {
    const result = await server.executeOperation({
      query: APPLICATION_QUERY,
      variables: {
        id: application.id,
      },
    });
    console.log(result.errors);
    expect(result.data).to.not.be.undefined;
    expect(result.data?.application.id).to.equal(application.id);
  });

  it("should create application draft", async () => {
    const result = await server.executeOperation({
      query: CREATE_APPLICATION_MUTATION,
      variables: {
        legalName: "Test",
      },
    });
    console.log(result.errors);
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(
      result.data?.createOrUpdateApplicationDraft.application.applicationState
    ).to.equal(ApplicationState.DRAFT);
    expect(
      result.data?.createOrUpdateApplicationDraft.application.applicationStep
    ).to.equal(ApplicationStep.STEP_1);
  });

  it("should update application draft for step one", async () => {
    const { data, errors } = await server.executeOperation(
      {
        query: UPDATE_APPLICATION_STEP_ONE_DRAFT_MUTATION,
        variables: {
          id: application.id,
          legalName: "Test",
          general: {
            address: "Street 1;21345;City;Germany",
            city: "Test",
            postcode: "12345",
            contactPerson: "qwertz",
            country: "Germamy",
            email: "testemail@email.com",
          },
        } as ApplicationStepOneDraftVariables,
      },
      { connection: connection }
    );
    console.log(errors);
    expect(data).to.not.be.undefined.and.to.not.be.null;
    expect(data?.updateApplicationStepOneDraft.success).to.be.true;
  });

  it("should submit application for step one", async () => {
    const { data } = await server.executeOperation(
      {
        query: SUBMIT_APPLICATION_STEP_ONE_MUTATION,
        variables: {
          id: application.id,
          legalName: "Test",
          general: {
            address: "Street 1;21345;City;Germany",
            city: "Test",
            postcode: "12345",
            contactPerson: "qwertz",
            country: "Germamy",
            email: "testemail@email.com",
          },
          missionStatement: "Our mission is to fulfill our mission",
          plannedProjects: "Planned is nothing yet",
          primaryImpactLocation: "Bangladesh",
          website: "ourwebsite.com",
          facebook: "facebook.com/blank/404",
          instagram: "instagram.com/test",
          other: "other",
          categoryIds: [1, 4],
          organisationType: OrganisationType.informalInitiative,
          mainInterestReason: MainInterestReason.fundraising,
          fundingType: FundingType.ongoing,
          acceptFundingFromCorporateSocialResponsibilityPartner: true,
          plannedFunding: FundingGoal.l,
          accountUsagePlan:
            "We want to break free from our own homepage which led to nowhere",
          links: {
            website: "Test",
          },
        } as ApplicationStepOneSubmitVariables,
      },
      { connection: connection }
    );
    expect(data).to.not.be.undefined.and.to.not.be.null;
    expect(data?.submitApplicationStepOne.success).to.be.true;
  });

  it("should update application draft for step two", async () => {
    application.applicationStep = ApplicationStep.STEP_2;
    application.applicationState = ApplicationState.INITIAL;
    const { data } = await server.executeOperation(
      {
        query: UPDATE_APPLICATION_STEP_TWO_DRAFT_MUTATION,
        variables: {
          id: application.id,
          integrateDonations: true
        } as ApplicationStepTwoDraftVariables,
      },
      { connection: connection }
    );
    expect(data).to.not.be.undefined.and.to.not.be.null;
    expect(data?.updateApplicationStepTwoDraft.success).to.be.true;
    expect(data?.updateApplicationStepTwoDraft.result.integrateDonations).to.be.true;
  });

  it("should submit application for step one", async () => {
    const result = await server.executeOperation(
      {
        query: SUBMIT_APPLICATION_STEP_TWO_MUTATION,
        variables: {
          id: application.id,
          validationMaterial: {
            links: [{ url: "Test"}],
            files: [{ name: "test", type: "test/type", size: 42 }]
          },
          organisationalStructure: {
            text: "Testtext",
            files: [{ name: "TestOrgStruc", type: "test/type", size: 24 }]
          },
          currentChannelsOfFundraising: "Many",
          channelsAndStrategies: "Some",
          integrateDonations: false,
          partnerOrganisations: "Few",
          fullTimeWorkers: "Many many many",
          stakeholderCount: "We have some yeah",
          organisationNeededResources: OrganisationNeededResources.financialConsultingAndBusinessModelGeneration,
          possibleAssistenceFromGaia: "We don't need support",
          firstProjectImpactsAppropriateness: "Ok, sounds cool",
          firstProjectBeneficiaries: "Yeah, heard of it",
          firstProjectStakeholderRepresentation: "We represent ourselves",
          firstProjectRisks: "No risks involved, all cool",
          firstProjectMilestoneValidation: "We don't need validation"
        } as ApplicationStepTwoSubmitVariables,
      },
      { connection: connection }
    );
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data?.submitApplicationStepOne.success).to.be.true;
  });
});
