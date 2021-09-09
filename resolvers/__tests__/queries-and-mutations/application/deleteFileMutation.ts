import gql from "graphql-tag";

export const DELETE_FILE_MUTATION = gql`
  mutation deleteFile($id: String!) {
    deleteUploadedFile(id: $id) {
      success
      problems {
        code
        message
      }
    }
  }
`;