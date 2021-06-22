import 'mocha';
import { createServerWithDummyUser } from '../server/testServerFactory';
import { createTestClient } from 'apollo-server-testing';
import { ADD_PROJECT, FETCH_PROJECT } from './graphqlApi/project';

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

    it('should query projects by id and category', async () => {
        const { query } = createTestClient(apolloServer);

        const params = { categoryIds: [1, 2], impactLocationIds: [1, 5] };

        const result = await query({
            query: FETCH_PROJECT,
            variables: {
                categories: params.categoryIds,
                locations: params.impactLocationIds
            }
        })

        
    })
});

before(async () => {
    apolloServer = await createServerWithDummyUser()
})

