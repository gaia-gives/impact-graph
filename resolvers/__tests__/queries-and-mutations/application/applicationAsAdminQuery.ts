import gql from "graphql-tag";

export const APPLICATION_AS_ADMIN_QUERY = gql`
  query applicationAsAdmin($id: String!) {
    applicationAsAdmin(id: $id) {
      id
    }
  }
`;