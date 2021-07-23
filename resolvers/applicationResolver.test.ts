import {
  OrganisationType,
  MainInterestReason,
  FundingType,
  ApplicationState,
  ApplicationStep,
} from "./../entities/application";
import { ApolloServer } from "apollo-server-express";
import "mocha";
import { expect } from "chai";
import { createTestServer } from "../server/testServerFactory";
import {
  GET_APPLICATION,
  GET_APPLICATIONS,
  CREATE_APPLICATION,
  SUBMIT_APPLICATION,
} from "./graphqlApi/application";
import * as TypeORM from "typeorm";

let server: ApolloServer;
let connection: TypeORM.Connection;

const createApplicationDraft: () => Promise<string> = async () => {
  const result = await server.executeOperation({
    query: CREATE_APPLICATION,
    variables: {
      legalName: "Test",
      address: "Street 1;21345;City;Germany",
      city: "Test",
      postcode: "12345",
      contactPerson: "qwertz",
      country: "Germamy",
      email: "testemail@email.com",
      missionStatement: "Our mission is to fulfill our mission",
      plannedProjects: "Planned is nothing yet",
      primaryImpactLocationId: 1,
      website: "ourwebsite.com",
      socialMediaUrls: ["facebook.com/blank/404", "instagram.com/test"],
      categoryIds: [1, 4],
      organisationType: OrganisationType.informalInitiative,
      mainInterestReason: MainInterestReason.fundraising,
      fundingType: FundingType.ongoing,
      acceptFundingFromCorporateSocialResponsibilityPartner: true,
      plannedFunding: 4000,
      accountUsagePlan:
        "We want to break free from our own homepage which led to nowhere",
      applicationStep: ApplicationStep.STEP_1,
      applicationState: ApplicationState.DRAFT,
    },
  });
  return result.data?.createOrUpdateApplicationDraft.id;
};

describe("application resolver", async () => {
  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
  });

  after(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query application draft", async () => {
    const applicationId = await createApplicationDraft();
    const result = await server.executeOperation({
      query: GET_APPLICATION,
      variables: {
        id: applicationId,
      },
    });

    console.log(result);
    expect(result.data).to.not.be.undefined;
    expect(result.data?.application.id).to.equal(applicationId);
  });

  it("should query applications", async () => {
    const result = await server.executeOperation({
      query: GET_APPLICATIONS,
    });
    expect(result.data).to.not.be.undefined;
  });

  it("should create application draft", async () => {
    const result = await server.executeOperation(
      {
        query: CREATE_APPLICATION,
        variables: {
          legalName: "Test",
          address: "Street 1;21345;City;Germany",
          city: "Test",
          postcode: "12345",
          contactPerson: "qwertz",
          country: "Germamy",
          email: "testemail@email.com",
          missionStatement: "Our mission is to fulfill our mission",
          plannedProjects: "Planned is nothing yet",
          primaryImpactLocationId: 1,
          website: "ourwebsite.com",
          socialMediaUrls: ["facebook.com/blank/404", "instagram.com/test"],
          categoryIds: [1, 4],
          organisationType: OrganisationType.informalInitiative,
          mainInterestReason: MainInterestReason.fundraising,
          fundingType: FundingType.ongoing,
          acceptFundingFromCorporateSocialResponsibilityPartner: true,
          plannedFunding: 4000,
          accountUsagePlan:
            "We want to break free from our own homepage which led to nowhere",
          applicationStep: ApplicationStep.STEP_1,
          applicationState: ApplicationState.DRAFT,
        },
      },
      { connection: connection }
    );

    console.log(result);
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(
      result.data?.createOrUpdateApplicationDraft.applicationState
    ).to.equal(ApplicationState.DRAFT);
    expect(
      result.data?.createOrUpdateApplicationDraft.applicationStep
    ).to.equal(ApplicationStep.STEP_1);
  });

  it("should submit application draft", async () => {
    const id = await createApplicationDraft();
    const result = await server.executeOperation(
      {
        query: SUBMIT_APPLICATION,
        variables: {
          id: id,
          legalName: "Test",
          address: "Street 1;21345;City;Germany",
          city: "Test",
          postcode: "12345",
          contactPerson: "qwertz",
          country: "Germamy",
          email: "testemail@email.com",
          missionStatement: "Our mission is to fulfill our mission",
          plannedProjects: "Planned is nothing yet",
          primaryImpactLocationId: 1,
          website: "ourwebsite.com",
          socialMediaUrls: ["facebook.com/blank/404", "instagram.com/test"],
          categoryIds: [1, 4],
          organisationType: OrganisationType.informalInitiative,
          mainInterestReason: MainInterestReason.fundraising,
          fundingType: FundingType.ongoing,
          acceptFundingFromCorporateSocialResponsibilityPartner: true,
          plannedFunding: 4000,
          accountUsagePlan:
            "We want to break free from our own homepage which led to nowhere",
          applicationStep: ApplicationStep.STEP_1,
          applicationState: ApplicationState.DRAFT,
        },
      },
      { connection: connection }
    );

    console.log(result);
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data?.submitApplication).to.be.true;
  });
});
