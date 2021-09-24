import gql from "graphql-tag";

export const SUBMIT_APPLICATION_STEP_ONE_MUTATION = gql`
  mutation submitApplicationStepOne(
    $id: String!
    $legalName: String!
    $general: SubmitGeneral!
    $missionStatement: String!
    $plannedProjects: String!
    $accountUsagePlan: String!
    $organisationType: OrganisationType!
    $primaryImpactLocation: String!
    $fundingType: FundingType!
    $plannedFunding: FundingGoal!
    $acceptFundingFromCorporateSocialResponsibilityPartner: Boolean!
    $mainInterestReason: MainInterestReason!
    $categories: [Category!]!
    $links: SubmitLinks!
  ) {
    submitApplicationStepOne(
      id: $id
      legalName: $legalName
      general: $general
      missionStatement: $missionStatement
      plannedProjects: $plannedProjects
      accountUsagePlan: $accountUsagePlan
      organisationType: $organisationType
      primaryImpactLocation: $primaryImpactLocation
      fundingType: $fundingType
      plannedFunding: $plannedFunding
      acceptFundingFromCorporateSocialResponsibilityPartner: $acceptFundingFromCorporateSocialResponsibilityPartner
      mainInterestReason: $mainInterestReason
      categories: $categories
      links: $links
    ) {
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