import gql from "graphql-tag";

export const GET_APPLICATION = gql`
  query application($id: ID!) {
    application(id: $id) {
      id
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query applications {
    applications {
      id
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation (
    $legalName: String!
    $dba: String!
    $address: String
    $email: String!
    $missionStatement: String!
    $website: String
    $socialMediaUrls: [String!]!
    $categoryIds: [Int!]!
  ) {
    createApplication(
      legalName: $legalName
      dba: $dba
      address: $address
      email: $email
      missionStatement: $missionStatement
      website: $website
      socialMediaUrls: $socialMediaUrls
      categoryIds: $categoryIds
    ) {
      id
    }
  }
`;
