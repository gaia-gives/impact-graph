import gql from "graphql-tag";

export const APPLICATIONS_AS_ADMIN_QUERY = gql`
  query applicationsAsAdmin($applicationState: String) {
    applicationsAsAdmin(applicationState: $applicationState) {
      applicationState
      applicationStep
      id
      legalName
    }
  }
`;