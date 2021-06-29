import { ApolloServer } from "apollo-server-express";
import "mocha";
import { createServerWithDummyUser } from "../server/testServerFactory";
import { ADD_PROJECT, FETCH_PROJECTS } from "./graphqlApi/project";
import { expect } from "chai";

let apolloServer: ApolloServer;

describe("Test Project Resolver", () => {
  before(async () => {
    apolloServer = await createServerWithDummyUser();
    await apolloServer.start();
  });

  it("Create Project", async () => {
    const sampleProject = {
      title: "title1",
    };
    const result = await apolloServer.executeOperation({
      query: ADD_PROJECT,
      variables: {
        project: sampleProject,
      },
    });

    const createProject = result.data?.addProject;
    expect(sampleProject.title).to.eq(createProject.title);
  });

  it("should query projects by impactLocations and categories", async () => {
    const params = { categoryIds: [5], impactLocationIds: [1] };

    const result = await apolloServer.executeOperation({
      query: FETCH_PROJECTS,
      variables: {
        categories: params.categoryIds,
        locations: params.impactLocationIds,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(2);
  });

  it("should query projects by only impactLocations", async () => {
    const params = { impactLocationIds: [3] };

    const result = await apolloServer.executeOperation({
      query: FETCH_PROJECTS,
      variables: {
        locations: params.impactLocationIds,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(3);
  });

  it("should query projects by only categories", async () => {
    const params = { categories: [5] };

    const result = await apolloServer.executeOperation({
      query: FETCH_PROJECTS,
      variables: {
        categories: params.categories,
      },
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(5);
  });

  it("should query projects without filter parameter given", async () => {
    const params = { categories: [5] };

    const result = await apolloServer.executeOperation({
      query: FETCH_PROJECTS,
    });

    expect(result.data).to.not.be.null;
    expect(result.data?.projects).to.be.lengthOf(5);
  });

  after(async () => {
    if (apolloServer) {
      await apolloServer.stop();
    }
  });
});
