import { ApolloServer } from "apollo-server-express";
import "mocha";
import { expect } from "chai";
import { createTestServer } from "../server/testServerFactory";
import {
  GET_APPLICATION,
  GET_APPLICATIONS,
  CREATE_APPLICATION,
} from "./graphqlApi/application";
import * as TypeORM from "typeorm"

let server: ApolloServer;
let connection: TypeORM.Connection;

describe("application resolver", () => {
  beforeEach(async () => {
    [connection, server] = await createTestServer();
    await server.start();
  });

  afterEach(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query application", async () => {
    const result = await server.executeOperation({
      query: GET_APPLICATION,
      variables: {
        id: 1,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.application.id).to.equal("1");
  });

  it("should query applications", async () => {
    const result = await server.executeOperation({
      query: GET_APPLICATIONS,
    });

    expect(result.data).to.not.be.null;
  });
});
