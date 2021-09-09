import gql from "graphql-tag";

export const APPROVE_APPLICATION_MUTATION = gql`
  mutation approveApplication($id: String! $adminComment: String!) {
    approveApplication(id: $id, adminComment: $adminComment) {
      id
    }
  }
`;