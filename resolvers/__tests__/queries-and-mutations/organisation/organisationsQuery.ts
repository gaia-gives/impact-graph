import gql from "graphql-tag";

export const ORGANISATIONS_QUERY = gql`
  query organisations {
    organisations {
      id
      title
      description
      mediaLink
      totalDonors
      raisedInTotal
    }
  }
`;