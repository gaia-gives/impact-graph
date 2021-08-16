import gql from "graphql-tag";

export const GET_APPLICATION = gql`
  query application($id: String!) {
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
  mutation createOrUpdateApplicationDraft(
    $id: String
    $legalName: String
    $address: String
    $city: String
    $postcode: String
    $country: String
    $contactPerson: String
    $email: String
    $missionStatement: String
    $plannedProjects: String
    $website: String
    $primaryImpactLocation: String
    $organisationType: OrganisationType
    $mainInterestReason: MainInterestReason
    $fundingType: FundingType
    $acceptFundingFromCorporateSocialResponsibilityPartner: Boolean
    $plannedFunding: FundingGoal
    $accountUsagePlan: String
    $facebook: String
    $instagram: String
    $other: String
    $categoryIds: [Int!]
  ) {
    createOrUpdateApplicationDraft(
      id: $id
      legalName: $legalName
      address: $address
      city: $city
      postcode: $postcode
      country: $country
      contactPerson: $contactPerson
      email: $email
      missionStatement: $missionStatement
      plannedProjects: $plannedProjects
      website: $website
      primaryImpactLocation: $primaryImpactLocation
      organisationType: $organisationType
      mainInterestReason: $mainInterestReason
      fundingType: $fundingType
      acceptFundingFromCorporateSocialResponsibilityPartner: $acceptFundingFromCorporateSocialResponsibilityPartner
      plannedFunding: $plannedFunding
      accountUsagePlan: $accountUsagePlan
      categoryIds: $categoryIds
      facebook: $facebook
      instagram: $instagram
      other: $other
    ) {
      success
      problems {
        code
        message
      }
      application {
        id
        applicationStep
        applicationState
      }
    }
  }
`;

export const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication(
    $id: String!
    $legalName: String!
    $address: String!
    $city: String!
    $postcode: String!
    $country: String!
    $contactPerson: String!
    $email: String!
    $missionStatement: String!
    $plannedProjects: String!
    $website: String!
    $primaryImpactLocation: String!
    $organisationType: OrganisationType!
    $mainInterestReason: MainInterestReason!
    $fundingType: FundingType!
    $acceptFundingFromCorporateSocialResponsibilityPartner: Boolean!
    $plannedFunding: FundingGoal!
    $accountUsagePlan: String!
    $facebook: String
    $instagram: String
    $other: String
    $categoryIds: [Int!]!
  ) {
    submitApplicationStepOne(
      id: $id
      legalName: $legalName
      address: $address
      city: $city
      postcode: $postcode
      country: $country
      contactPerson: $contactPerson
      email: $email
      missionStatement: $missionStatement
      plannedProjects: $plannedProjects
      website: $website
      primaryImpactLocation: $primaryImpactLocation
      organisationType: $organisationType
      mainInterestReason: $mainInterestReason
      fundingType: $fundingType
      acceptFundingFromCorporateSocialResponsibilityPartner: $acceptFundingFromCorporateSocialResponsibilityPartner
      plannedFunding: $plannedFunding
      accountUsagePlan: $accountUsagePlan
      categoryIds: $categoryIds
      facebook: $facebook
      instagram: $instagram
      other: $other
    ) {
      success
      problems {
        code
        message
      }
    }
  }
`;

export const UPLOAD_FILE = gql`
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

export const DELETE_FILE = gql`
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

export const APPLICATIONS_AS_ADMIN = gql`
  query applicationsAsAdmin($applicationState: String) {
    applicationsAsAdmin(applicationState: $applicationState) {
      applicationState
      applicationStep
      id
      legalName
    }
  }
`;
