import { APPLICATIONS_AS_ADMIN } from "./../graphqlApi/application";
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
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(2);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.not.include(ApplicationState.DRAFT);
  });

  it("should query applications as an admin only accepted", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.ACCEPTED } });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.include(ApplicationState.ACCEPTED);
  });

  it("should query applications as an admin only pending", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.PENDING } });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(0);
  });

  it("should query applications as an admin only rejected", async () => {
    const result = await server.executeOperation({ query: APPLICATIONS_AS_ADMIN, variables: { applicationState: ApplicationState.REJECTED } });

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(result.data!.applicationsAsAdmin.map(a => a.applicationState)).to.include(ApplicationState.REJECTED);
  });
});
