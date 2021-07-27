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
    $applicationStep: ApplicationStep!
    $applicationState: ApplicationState!
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
      applicationStep: $applicationStep
      applicationState: $applicationState
      facebook: $facebook
      instagram: $instagram
      other: $other
    ) {
      id
      applicationStep
      applicationState
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
    $applicationStep: ApplicationStep!
    $applicationState: ApplicationState!
  ) {
    submitApplication(
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
      applicationStep: $applicationStep
      applicationState: $applicationState
      facebook: $facebook
      instagram: $instagram
      other: $other
    )
  }
`;
