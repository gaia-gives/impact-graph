import gql from "graphql-tag";

const ORGANISATIONS = gql`
  query Organisations {
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

const ORGANISATION_BY_ID = gql`
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

export { ORGANISATIONS, ORGANISATION_BY_ID };
