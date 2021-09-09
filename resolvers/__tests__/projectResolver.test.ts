import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import "mocha";
import { createTestServer } from "../../server/testServerFactory";
import { FETCH_PROJECTS_QUERY } from "./queries-and-mutations";
import { expect } from "chai";

let connection: TypeORM.Connection;
let server: ApolloServer;

describe("Test Project Resolver", () => {
  before(async () => {
    [connection, server] = await createTestServer();
    await server.start();
  });

  after(async () => {
    await server.stop();
    await connection.close();
  });

  it("should query projects by impactLocations and categories", async () => {
    const params = { categoryIds: [5], impactLocationIds: [1] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
      variables: {
        categories: params.categoryIds,
        locations: params.impactLocationIds,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(1);
  });

  it("should query projects by only impactLocations", async () => {
    const params = { impactLocationIds: [7] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
      variables: {
        locations: params.impactLocationIds,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(2);
  });

  it("should query projects by only categories", async () => {
    const params = { categories: [5] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
      variables: {
        categories: params.categories,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(2);
  });

  it("should query projects without filter parameter given", async () => {
    const params = { categories: [5] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(3);
  });
});
