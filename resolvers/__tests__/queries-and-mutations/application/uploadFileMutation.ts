import gql from "graphql-tag";

export const UPLOAD_FILE_MUTATION = gql`
  mutation uploadFile($id: ID!, $documents: [Upload!]!, $mapsToField: String!) {
    uploadApplicationDocument(
      id: $id
      documents: $documents
      mapsToField: $mapsToField
    ) {
      success
      problems {
        code
        message
      }
      savedFiles {
        id
        filename
        mimetype
      }
    }
  }
`;