import gql from "graphql-tag";

export const ADD_PROJECT_MUTATION = gql`
  mutation($project: ProjectInput!) {
    addProject(project: $project) {
      id
      title
      description
      admin
      image
      impactLocations {
        name
      }
      slug
      walletAddress
      categories {
        name
      }
    }
  }
`