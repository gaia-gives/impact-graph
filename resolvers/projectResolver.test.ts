import 'mocha';
import { createServerWithDummyUser } from '../server/testServerFactory';
import { createTestClient } from 'apollo-server-testing';
import { ADD_PROJECT, FETCH_PROJECTS } from './graphqlApi/project';
import { expect } from 'chai';

let apolloServer;

describe('Test Project Resolver', () => {
    it('Create Project', async () => {
        const { query, mutate } = createTestClient(apolloServer);

        const sampleProject = {
            title: 'title1'
        }
        const result = await mutate({
            mutation: ADD_PROJECT,
            variables: {
                project: sampleProject
            },
        })

        // const createProject = result.data.addProject

        // expect(sampleProject.title).to.eq(createProject.title);
    });

    it('should query projects by impactLocations and categories', async () => {
        const { query } = createTestClient(apolloServer);

        const params = { categoryIds: [5], impactLocationIds: [1] };

        const result = await query({
            query: FETCH_PROJECTS,
            variables: {
                categories: params.categoryIds,
                locations: params.impactLocationIds
            }
        });

        expect(result.data).to.not.be.null;
        expect(result.data.projects).to.be.lengthOf(2);
    });

    it('should query projects by only impactLocations', async () => {
        const { query } = createTestClient(apolloServer);

        const params = { impactLocationIds: [3] };

        const result = await query({
            query: FETCH_PROJECTS,
            variables: {
                locations: params.impactLocationIds
            }
        });

        expect(result.data).to.not.be.null;
        expect(result.data.projects).to.be.lengthOf(3);
    });

    it('should query projects by only categories', async () => {
        const { query } = createTestClient(apolloServer);

        const params = { categories: [5] };

        const result = await query({
            query: FETCH_PROJECTS,
            variables: {
                categories: params.categories
            }
        });

        expect(result.data).to.not.be.null;
        expect(result.data.projects).to.be.lengthOf(5);
    });

    it('should query projects without filter parameter given', async () => {
        const { query } = createTestClient(apolloServer);

        const params = { categories: [5] };

        const result = await query({
            query: FETCH_PROJECTS
        });

        expect(result.data).to.not.be.null;
        expect(result.data.projects).to.be.lengthOf(5);
    });
});

before(async () => {
    apolloServer = await createServerWithDummyUser()
})

