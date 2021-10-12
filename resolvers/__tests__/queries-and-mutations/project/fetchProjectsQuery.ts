import gql from "graphql-tag";

export const FETCH_PROJECTS_QUERY = gql`
  query FetchProjects($limit: Int, $skip: Int, $orderBy: OrderBy, $categories: [Category!], $locations: [Int!]) {
    projects(take: $limit, skip: $skip, orderBy: $orderBy, categories: $categories, locations: $locations) {
      id
      title
      image
      slug
      creationDate
      admin
      categories
      impactLocations {
        id
        name
      }
    }
  }
`;