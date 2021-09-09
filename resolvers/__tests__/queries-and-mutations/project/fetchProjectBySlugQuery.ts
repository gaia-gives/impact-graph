import gql from "graphql-tag";

export const FETCH_PROJECT_BY_SLUG = gql`
  query ProjectBySlug($slug: String!) {
    projectBySlug(slug: $slug) {
      id
      title
      description
      image
      slug
      creationDate
      admin
      walletAddress
      categories {
        name
      }
    }
  }
`