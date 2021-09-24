import {
  APPLICATIONS_AS_ADMIN_QUERY,
  APPLICATION_AS_ADMIN_QUERY,
  CREATE_APPLICATION_MUTATION,
  APPROVE_APPLICATION_MUTATION,
  DECLINE_APPLICATION_MUTATION,
} from "./queries-and-mutations";
import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import { createTestServer } from "../../server/testServerFactory";
import { expect } from "chai";
import { Application, ApplicationState } from "../../entities/application";

let server: ApolloServer;
let connection: TypeORM.Connection;

const createApplication: () => Promise<Application> = async () => {
  const { data } = await server.executeOperation(
    {
      query: CREATE_APPLICATION_MUTATION,
      variables: {
        legalName: "Test",
      },
    },
  );
  return data?.createApplication.result;
};

describe("application administration resolver", async () => {
  let application;

  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
    application = await createApplication();
  });

  after(async () => {
    await server.stop();
    await connection.dropDatabase();
    await connection.close();
  });

  it("should query applications as an admin", async () => {
    const result = await server.executeOperation(
      { query: APPLICATIONS_AS_ADMIN_QUERY },
    );
    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(2);
    expect(
      result.data!.applicationsAsAdmin.map((a) => a.applicationState)
    ).to.not.include(ApplicationState.DRAFT);
  });

  it("should query applications as an admin only accepted", async () => {
    const result = await server.executeOperation(
      {
        query: APPLICATIONS_AS_ADMIN_QUERY,
        variables: { applicationState: ApplicationState.ACCEPTED },
      },
    );

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(
      result.data!.applicationsAsAdmin.map((a) => a.applicationState)
    ).to.include(ApplicationState.ACCEPTED);
  });

  it("should query applications as an admin only pending", async () => {
    const result = await server.executeOperation(
      {
        query: APPLICATIONS_AS_ADMIN_QUERY,
        variables: { applicationState: ApplicationState.PENDING },
      },
    );

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(0);
  });

  it("should query applications as an admin only rejected", async () => {
    const result = await server.executeOperation(
      {
        query: APPLICATIONS_AS_ADMIN_QUERY,
        variables: { applicationState: ApplicationState.REJECTED },
      },
    );

    expect(result.data).to.not.be.undefined.and.to.not.be.null;
    expect(result.data!.applicationsAsAdmin.length).to.equal(1);
    expect(
      result.data!.applicationsAsAdmin.map((a) => a.applicationState)
    ).to.include(ApplicationState.REJECTED);
  });

  it("should get single application by id", async () => {
    const result = await server.executeOperation(
      {
        query: APPLICATION_AS_ADMIN_QUERY,
        variables: { id: application.id },
      },
    );
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
    expect(result.data!.applicationAsAdmin.id).to.equal(
      application.id
    );
  });

  it("should update comment as admin on accept", async () => {
    const result = await server.executeOperation(
      {
        query: APPROVE_APPLICATION_MUTATION,
        variables: {
          id: application.id,
          adminComment: "Test",
        },
      },
    );
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
  });

  it("should update comment as admin on decline", async () => {
    const result = await server.executeOperation(
      {
        query: DECLINE_APPLICATION_MUTATION,
        variables: {
          id: application.id,
          adminComment: "Test",
        },
      },
    );
    expect(result.data).to.not.be.null.and.to.not.be.undefined;
  });
});
