import gql from "graphql-tag";

export const SUBMIT_APPLICATION_STEP_TWO_MUTATION = gql`
  fragment FileFragment on FileObjectType {
    id
    name
    type
    size
  }
  mutation submitApplicationStepTwo(
    $id: ID!
    $charter: [FileInputType!]!
    $document501c3: [FileInputType!]!
    $validationMaterial: SubmitValidationMaterial!
    $organisationalStructure: SubmitOrganisationalStructure!
    $currentChannelsOfFundraising: String!
    $channelsAndStrategies: String!
    $integrateDonations: Boolean!
    $partnerOrganisations: String!
    $fullTimeWorkers: String!
    $stakeholderCount: String!
    $organisationNeededResources: OrganisationNeededResources!
    $possibleAssistenceFromGaia: String!
    $firstProjectImpactsAppropriateness: String!
    $firstProjectBeneficiaries: String!
    $firstProjectStakeholderRepresentation: String!
    $firstProjectRisks: String!
    $firstProjectMilestoneValidation: String!
  ) {
    submitApplicationStepTwo(
      id: $id
      charter: $charter
      document501c3: $document501c3
      validationMaterial: $validationMaterial
      organisationalStructure: $organisationalStructure
      channelsAndStrategies: $channelsAndStrategies
      integrateDonations: $integrateDonations
      partnerOrganisations: $partnerOrganisations
      fullTimeWorkers: $fullTimeWorkers
      stakeholderCount: $stakeholderCount
      organisationNeededResources: $organisationNeededResources
      currentChannelsOfFundraising: $currentChannelsOfFundraising
      possibleAssistenceFromGaia: $possibleAssistenceFromGaia
      firstProjectImpactsAppropriateness: $firstProjectImpactsAppropriateness
      firstProjectBeneficiaries: $firstProjectBeneficiaries
      firstProjectStakeholderRepresentation: $firstProjectStakeholderRepresentation
      firstProjectRisks: $firstProjectRisks
      firstProjectMilestoneValidation: $firstProjectMilestoneValidation
    ) {
      result {
        id
        charter {
          ...FileFragment
        }
        document501c3 {
          ...FileFragment
        }
        validationMaterial {
          links {
            url
          }
          files {
            ...FileFragment
          }
        }
        organisationalStructure {
          text
          files {
            ...FileFragment
          }
        }
        currentChannelsOfFundraising
        channelsAndStrategies
        integrateDonations
        partnerOrganisations
        fullTimeWorkers
        stakeholderCount
        organisationNeededResources
        possibleAssistenceFromGaia
        firstProjectImpactsAppropriateness
        firstProjectBeneficiaries
        firstProjectStakeholderRepresentation
        firstProjectRisks
        firstProjectMilestoneValidation
        applicationState
        applicationStep
        lastEdited
        adminCommentStepTwo
      }
      success
      problems {
        code
        message
      }
    }
  }
`;
