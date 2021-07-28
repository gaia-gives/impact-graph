import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import "mocha";
import { expect } from "chai";
import { createTestServer } from "../../server/testServerFactory";
import { ORGANISATIONS, ORGANISATION_BY_ID } from "./../graphqlApi/organisation";

let connection: TypeORM.Connection;
let server: ApolloServer;

describe("Test Organisation Resolver", () => {
  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
  });

  after(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query organisations", async () => {
    const result = await server.executeOperation({
      query: ORGANISATIONS,
    });

    expect(result.data).to.not.be.null;
  });

  it("should query organisation by id", async () => {
    const result = await server.executeOperation({
      query: ORGANISATION_BY_ID,
      variables: {
        organisationId: 1,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.organisationById.id).to.equal("1");
  });

  after(async () => {
    if (server) {
      await server.stop();
    }
  });
});
