import { gql } from "apollo-server-core";

export const PROJECTS_BY_ORGANISATION_ID_QUERY = gql`
  query projectsByOrganisationId($organisationId: Int!) {
    projectsByOrganisationId(organisationId: $organisationId) {
      title
      description
      subHeadline
      image
      status
      totalDonations
      totalDonors
    }
  }
`;
