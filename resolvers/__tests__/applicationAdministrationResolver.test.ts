import { APPLICATIONS_AS_ADMIN, APPLICATION_AS_ADMIN, CREATE_APPLICATION, APPROVE_APPLICATION, DECLINE_APPLICATION } from "./../graphqlApi/application";
import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import { createTestServer } from "../../server/testServerFactory";
import { expect } from "chai";
import { ApplicationState } from "../../entities/application";

let server: ApolloServer;
let connection: TypeORM.Connection;

describe("application administration resolver", async () => {
  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
  });

  after(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query applications as an admin", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN }, { connection });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(2);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.not.include(ApplicationState.DRAFT);
  });

  it("should query applications as an admin only accepted", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.ACCEPTED } }, { connection });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.include(ApplicationState.ACCEPTED);
  });

  it("should query applications as an admin only pending", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.PENDING } }, { connection });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(0);
  });

  it("should query applications as an admin only rejected", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.REJECTED } }, { connection });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.include(ApplicationState.REJECTED);
  });

  it("should get single application by id", async () => {
    const draft = await server.executeOperation({
      query: CREATE_APPLICATION,
      variables: {
        legalName: "Test",
      }
    }, { connection });
    const result = await server.executeOperation({ query: APPLICATION_AS_ADMIN, variables: { id: draft.data!.createOrUpdateApplicationDraft.application.id } }, { connection });
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
    expect(result.data!.applicationAsAdmin.id).to.equal(draft.data!.createOrUpdateApplicationDraft.application.id);
  });
  
  it("should update comment as admin on accept", async () => {
    const draft = await server.executeOperation({
      query: CREATE_APPLICATION,
      variables: {
        legalName: "Test",
      }
    }, { connection });
    const result = await server.executeOperation({ query: APPROVE_APPLICATION, variables: { id: draft.data!.createOrUpdateApplicationDraft.application.id, adminComment: "Test" } }, { connection });
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
  });

  it("should update comment as admin on decline", async () => {
    const draft = await server.executeOperation({
      query: CREATE_APPLICATION,
      variables: {
        legalName: "Test",
      }
    }, { connection });
    const result = await server.executeOperation({ query: DECLINE_APPLICATION, variables: { id: draft.data!.createOrUpdateApplicationDraft.application.id, adminComment: "Test" } }, { connection });
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
  });
});
