import gql from "graphql-tag";

export const DECLINE_APPLICATION_MUTATION = gql`
  mutation declineApplication($id: String! $adminComment: String!) {
    declineApplication(id: $id, adminComment: $adminComment) {
      id
    }
  }
`;
