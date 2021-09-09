import gql from "graphql-tag";

export const ADD_PROJECT_UPDATE_MUTATION = gql`
  mutation($projectId: Float!, $title: String!, $content: String!) {
    addProjectUpdate(projectId: $projectId, title: $title, content: $content) {
      id
      projectId
      userId
      content
    }
  }
`