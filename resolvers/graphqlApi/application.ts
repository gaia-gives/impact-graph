import { OrganisationType, MainInterestReason, FundingType, ApplicationStep } from './../../entities/application';
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
  mutation createOrUpdateApplicationDraft (
    $legalName: String
    $address: String
    $email: String
    $missionStatement: String
    $plannedProjects: String
    $website: String
    $primaryImpactLocationId: Float
    $organisationType: OrganisationType
    $mainInterestReason: MainInterestReason
    $fundingType: FundingType
    $acceptFundingFromCorporateSocialResponsibilityPartner: Boolean
    $plannedFunding: Float
    $accountUsagePlan: String
    $socialMediaUrls: [String!]
    $categoryIds: [Int!]
    $applicationStep: ApplicationStep!
    $applicationState: ApplicationState!
  ) {
    createOrUpdateApplicationDraft(
      legalName: $legalName
      address: $address
      email: $email
      missionStatement: $missionStatement
      plannedProjects: $plannedProjects
      website: $website
      primaryImpactLocationId: $primaryImpactLocationId
      organisationType: $organisationType
      mainInterestReason: $mainInterestReason
      fundingType: $fundingType
      acceptFundingFromCorporateSocialResponsibilityPartner: $acceptFundingFromCorporateSocialResponsibilityPartner
      plannedFunding: $plannedFunding
      accountUsagePlan: $accountUsagePlan
      socialMediaUrls: $socialMediaUrls
      categoryIds: $categoryIds
      applicationStep: $applicationStep
      applicationState: $applicationState
    ) {
      id
      applicationStep
      applicationState
    }
  }
`;
