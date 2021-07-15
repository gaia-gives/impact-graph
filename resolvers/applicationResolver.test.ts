import { ApolloServer } from "apollo-server-express";
import "mocha";
import { expect } from "chai";
import { createServerWithDummyUser } from "../server/testServerFactory";
import {
  GET_APPLICATION,
  GET_APPLICATIONS,
  CREATE_APPLICATION,
} from "./graphqlApi/application";

let apolloServer: ApolloServer;

describe("application resolver", () => {
  before(async () => {
    apolloServer = await createServerWithDummyUser();
    await apolloServer.start();
  });

  it("should query application", async () => {
    const result = await apolloServer.executeOperation({
      query: GET_APPLICATION,
      variables: {
        id: 1,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.application.id).to.equal("1");
  });

  it("should query applications", async () => {
    const result = await apolloServer.executeOperation({
      query: GET_APPLICATIONS,
    });

    expect(result.data).to.not.be.null;
  });

  after(async () => {
    if (apolloServer) {
      await apolloServer.stop();
    }
  });
});
