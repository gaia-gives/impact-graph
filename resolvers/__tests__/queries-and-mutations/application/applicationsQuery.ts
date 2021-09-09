import gql from "graphql-tag";

export const APPLICATIONS_QUERY = gql`
  query applications {
    applications {
      id
    }
  }
`;