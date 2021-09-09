import gql from "graphql-tag";

export const ORGANISATION_BY_ID_QUERY = gql`
  query organisationById($organisationId: Float!) {
    organisationById(organisationId: $organisationId) {
      id
      title
      description
      mediaLink
      totalDonors
      raisedInTotal
      projects {
        id
      }
    }
  }
`;