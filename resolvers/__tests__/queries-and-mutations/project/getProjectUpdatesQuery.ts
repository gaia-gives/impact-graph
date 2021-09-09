import gql from "graphql-tag";

export const GET_PROJECT_UPDATES = gql`
  query GetProjectUpdates($projectId: Float!, $take: Float!, $skip: Float!) {
    getProjectUpdates(projectId: $projectId, take: $take, skip: $skip) {
      projectUpdate {
        id
        title
        content
        createdAt
        projectId
        userId
      }
      reactions {
        reaction
        userId
      }
    }
  }
`