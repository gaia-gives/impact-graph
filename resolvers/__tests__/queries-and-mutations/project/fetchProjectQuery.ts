import gql from "graphql-tag";

const FETCH_PROJECT_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      admin
      title
      description
      image
      slug
      creationDate
      walletAddress
      categories
    }
  }
`