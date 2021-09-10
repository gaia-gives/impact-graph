import gql from "graphql-tag";

export const APPLICATION_QUERY = gql`
  query application($id: String!) {
    application(id: $id) {
      success
      problems {
        code
        message
      }
      result {
        id
      }
    }
  }
`;
