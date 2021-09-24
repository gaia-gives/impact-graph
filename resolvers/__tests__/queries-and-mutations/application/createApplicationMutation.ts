import gql from "graphql-tag";

export const CREATE_APPLICATION_MUTATION = gql`
  mutation createApplication($legalName: String!) {
    createApplication(legalName: $legalName) {
      success
      problems {
        code
        message
      }
      result {
        id
        applicationState
        applicationStep
      }
    }
  }
`;