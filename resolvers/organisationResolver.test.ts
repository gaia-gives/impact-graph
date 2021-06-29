import { ApolloServer } from "apollo-server-express";
import "mocha";
import { createTestClient } from "apollo-server-testing";
import { expect } from "chai";
import { createServerWithDummyUser } from "../server/testServerFactory";
import { ORGANISATIONS, ORGANISATION_BY_ID } from "./graphqlApi/organisation";

let apolloServer: ApolloServer;

describe("Test Organisation Resolver", () => {
  before(async () => {
    apolloServer = await createServerWithDummyUser();
    await apolloServer.start();
  });

  it("should query organisations", async () => {

    const result = await apolloServer.executeOperation({
      query: ORGANISATIONS,
    });

    expect(result.data).to.not.be.null;
  });

  after(async () => {
      if (apolloServer) {
          await apolloServer.stop();
      }
  });

  it("should query organisation by id", async () => {

    const result = await apolloServer.executeOperation({
      query: ORGANISATION_BY_ID,
      variables: {
          organisationId: 1
      }
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.organisationById[0].id).to.equal('1');
  });

  after(async () => {
      if (apolloServer) {
          await apolloServer.stop();
      }
  });
});
