import gql from "graphql-tag";

export const FETCH_TOP_PROJECTS_QUERY = gql`
  query FetchProjects($limit: Int, $skip: Int, $orderBy: OrderBy, $category: Int) {
    topProjects(take: $limit, skip: $skip, orderBy: $orderBy, category: $category) {
      projects {
        id
        title
        balance
        image
        slug
        creationDate
        admin
        walletAddress
        categories {
          name
        }
      }
      totalCount
    }
  }
`