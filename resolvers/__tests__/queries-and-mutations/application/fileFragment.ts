import gql from "graphql-tag";

export const FILE_FRAGMENT = gql`
  fragment FileFragment on FileObjectType {
    id
    name
    type
    size
  }
`;