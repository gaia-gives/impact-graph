import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import "mocha";
import { createTestServer } from "../../server/testServerFactory";
import { FETCH_PROJECTS_QUERY, PROJECTS_BY_ORGANISATION_ID_QUERY } from "./queries-and-mutations";
import { expect } from "chai";
import { Category } from "../../entities/category";
import { Organisation } from "../../entities/organisation";

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
    const params = { categories: [Category.protectionOfBasicNeeds, Category.educationAndResearch], impactLocationIds: [7] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
      variables: {
        categories: params.categories,
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
    const params = { categories: [Category.industryTransformation] };

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
    const params = { categories: [Category.industryTransformation] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS_QUERY,
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(3);
  });

  it("should query projects by organisation id", async () => {
    const organisations = (await connection.query(`SELECT * FROM "organisation" LIMIT 1;`)) as Organisation[];
    const params = { organisationId: organisations[0].id };

    const { data, errors } = await server.executeOperation({
      query: PROJECTS_BY_ORGANISATION_ID_QUERY,
      variables: params
    })

    expect(data).to.not.be.null;
    expect(data?.projectsByOrganisationId).to.be.lengthOf(3);
  });
});
