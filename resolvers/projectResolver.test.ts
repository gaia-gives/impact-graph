import { ProjectInput } from './types/project-input';
import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import "mocha";
import { createTestServer } from "../server/testServerFactory";
import { ADD_PROJECT, FETCH_PROJECTS } from "./graphqlApi/project";
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

  // it("Create Project", async () => {
  //   const sampleProject: ProjectInput = {
  //     title: "title1",
  //     categories: ["2"],

  //   };
  //   const result = await server.executeOperation({
  //     query: ADD_PROJECT,
  //     variables: {
  //       projectInput: sampleProject,
  //     },
  //   });

  //   console.log(result);

  //   const createProject = result.data?.addProject;
  //   expect(sampleProject.title).to.eq(createProject.title);
  // });

  it("should query projects by impactLocations and categories", async () => {
    const params = { categoryIds: [5], impactLocationIds: [1] };

    const result = await server.executeOperation({
      query: FETCH_PROJECTS,
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
      query: FETCH_PROJECTS,
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
      query: FETCH_PROJECTS,
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
      query: FETCH_PROJECTS,
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(3);
  });
});
