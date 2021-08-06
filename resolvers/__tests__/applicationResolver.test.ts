import { DELETE_FILE, UPLOAD_FILE } from "./../graphqlApi/application";
import {
  OrganisationType,
  MainInterestReason,
  FundingType,
  ApplicationState,
  ApplicationStep,
  FundingGoal,
} from "../../entities/application";
import { ApolloServer } from "apollo-server-express";
import "mocha";
import { expect } from "chai";
import { createTestServer } from "../../server/testServerFactory";
import {
  GET_APPLICATION,
  GET_APPLICATIONS,
  CREATE_APPLICATION,
  SUBMIT_APPLICATION,
} from "../graphqlApi/application";
import * as TypeORM from "typeorm";
import fs from "fs/promises";
import path from "path";
import { createReadStream } from "fs";

let server: ApolloServer;
let connection: TypeORM.Connection;

const testFilePath = path.join(process.cwd(), "resolvers", "__tests__", "testFile.txt");

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
      primaryImpactLocation: "Middle of nowhere",
      website: "ourwebsite.com",
      facebook: "facebook.com/blank/404",
      instagram: "instagram.com/test",
      other: "other",
      categoryIds: [1, 4],
      organisationType: OrganisationType.informalInitiative,
      mainInterestReason: MainInterestReason.fundraising,
      fundingType: FundingType.ongoing,
      acceptFundingFromCorporateSocialResponsibilityPartner: true,
      plannedFunding: FundingGoal.m,
      accountUsagePlan:
        "We want to break free from our own homepage which led to nowhere"
    },
  });
  return result.data?.createOrUpdateApplicationDraft.application.id;
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
          primaryImpactLocation: "Middle of nowhere",
          website: "ourwebsite.com",
          facebook: "facebook.com/blank/404",
          instagram: "instagram.com/test",
          other: "other",
          categoryIds: [1, 4],
          organisationType: OrganisationType.informalInitiative,
          mainInterestReason: MainInterestReason.fundraising,
          fundingType: FundingType.ongoing,
          acceptFundingFromCorporateSocialResponsibilityPartner: true,
          plannedFunding: FundingGoal.m,
          accountUsagePlan:
            "We want to break free from our own homepage which led to nowhere"
        },
      },
      { connection: connection }
    );
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(
      result.data?.createOrUpdateApplicationDraft.application.applicationState
    ).to.equal(ApplicationState.DRAFT);
    expect(
      result.data?.createOrUpdateApplicationDraft.application.applicationStep
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
            "We want to break free from our own homepage which led to nowhere"
        },
      },
      { connection: connection }
    );
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data?.submitApplicationStepOne.success).to.be.true;
  });

  // it("should upload a file", async () => {
  //     const application = createApplicationDraft();
  //     console.log(testFilePath);
  //     const file = await fs.readFile(testFilePath);
  //     const stream = createReadStream(file);
  //     const result = await server.executeOperation({
  //       query: UPLOAD_FILE,
  //       variables: {
  //         id: application,
  //         documents: [stream],
  //         mapsToField: "Test"
  //       },
  //     });
  
  //     console.log(result);
  //     expect(result.data).to.not.be.undefined.and.to.not.be.null;
  //     expect(result.data?.success).to.be.true;

  // });

  // it("should delete an existing file", async () => {
  //   const application = createApplicationDraft();
  //   const file = await fs.readFile(testFilePath);
  //   const stream = createReadStream(file);
  //   const fileUpload = await server.executeOperation({
  //     query: UPLOAD_FILE,
  //     variables: {
  //       id: application,
  //       documents: [stream],
  //       mapsToField: "Test"
  //     },
  //   });

  //   const result = await server.executeOperation({
  //     query: DELETE_FILE,
  //     variables: {
  //       id: fileUpload.data!.fileReferences[0]
  //     }
  //   });

  //   console.log(result);
  //   expect(result.data).to.not.be.undefined.and.to.not.be.null;
  //   expect(result.data?.success).to.be.true;
  // });
});
