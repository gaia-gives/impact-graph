import gql from "graphql-tag";

export const UPDATE_APPLICATION_STEP_ONE_DRAFT_MUTATION = gql`
  mutation updateApplicationStepOneDraft(
    $id: String!
    $legalName: String
    $general: GeneralInputType
    $missionStatement: String
    $plannedProjects: String
    $primaryImpactLocation: String
    $organisationType: OrganisationType
    $mainInterestReason: MainInterestReason
    $fundingType: FundingType
    $acceptFundingFromCorporateSocialResponsibilityPartner: Boolean
    $plannedFunding: FundingGoal
    $accountUsagePlan: String
    $categories: [Category!]
    $links: LinksInputType
  ) {
    updateApplicationStepOneDraft(
      id: $id
      legalName: $legalName
      general: $general
      missionStatement: $missionStatement
      plannedProjects: $plannedProjects
      primaryImpactLocation: $primaryImpactLocation
      organisationType: $organisationType
      mainInterestReason: $mainInterestReason
      fundingType: $fundingType
      acceptFundingFromCorporateSocialResponsibilityPartner: $acceptFundingFromCorporateSocialResponsibilityPartner
      plannedFunding: $plannedFunding
      accountUsagePlan: $accountUsagePlan
      categories: $categories
      links: $links
    ) {
      problems {
        code
        message
      }
      success
      result {
        id
        legalName
        general {
          address
          city
          postcode
          country
          contactPerson
          email
        }
        missionStatement
        plannedProjects
        accountUsagePlan
        organisationType
        primaryImpactLocation
        fundingType
        plannedFunding
        acceptFundingFromCorporateSocialResponsibilityPartner
        mainInterestReason
        categories
        links {
          website
          facebook
          instagram
          other
        }
        applicationStep
        applicationState
        lastEdited
      }
    }
  }
`;