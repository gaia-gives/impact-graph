// import {ApplicationStepTwoDraftVariables} from './../types/application/ApplicationStepTwoDraft';
// import {UPDATE_APPLICATION_STEP_ONE_DRAFT_MUTATION} from "./queries-and-mutations/application/updateApplicationStepOneDraftMutation";
// import {
//   APPLICATION_QUERY, APPROVE_APPLICATION_MUTATION,
//   CREATE_APPLICATION_MUTATION,
//   SUBMIT_APPLICATION_STEP_ONE_MUTATION,
//   SUBMIT_APPLICATION_STEP_TWO_MUTATION,
//   UPDATE_APPLICATION_STEP_TWO_DRAFT_MUTATION,
// } from "./queries-and-mutations";
// import {
//   Application,
//   FundingGoal,
//   FundingType,
//   MainInterestReason,
//   OrganisationNeededResources,
//   OrganisationType,
// } from "../../entities/application";
// import {ApolloServer} from "apollo-server-express";
// import "mocha";
// import {expect} from "chai";
// import {createTestServer} from "../../server/testServerFactory";
// import * as TypeORM from "typeorm";
// import {
//   ApplicationStepOneDraftVariables,
//   ApplicationStepOneSubmitVariables,
//   ApplicationStepTwoSubmitVariables,
// } from "../types/application";
// import {Category} from "../../entities/category";

// let server: ApolloServer;
// let connection: TypeORM.Connection;
// let application: Application;

// const createApplication: () => Promise<Application> = async () => {
//   const { data } = await server.executeOperation(
//       {
//         query: CREATE_APPLICATION_MUTATION,
//         variables: {
//           legalName: "Test",
//         },
//       },
//   );
//   return data?.createApplication.result;
// };

// describe("application resolver", async () => {
//   before(async () => {
//     [connection, server] = await createTestServer();
//     application = new Application();
//     await server.start();
//     application = await createApplication();
//     console.log(application);
//   });

//   after(async () => {
//     await server.stop();
//     await connection.close();
//   });

//   it("should query application draft", async () => {
//     const result = await server.executeOperation({
//       query: APPLICATION_QUERY,
//       variables: {
//         id: application.id,
//       },
//     });
//     expect(result.data).to.not.be.undefined;
//     expect(result.data?.application.result.id).to.equal(application.id);
//   });

//   it("should update application draft for step one", async () => {
//     const { data, errors } = await server.executeOperation(
//       {
//         query: UPDATE_APPLICATION_STEP_ONE_DRAFT_MUTATION,
//         variables: {
//           id: application.id,
//           legalName: "Test",
//           general: {
//             address: "Street 1;21345;City;Germany",
//             city: "Test",
//             postcode: "12345",
//             contactPerson: "qwertz",
//             country: "Germamy",
//             email: "testemail@email.com",
//           },
//         } as ApplicationStepOneDraftVariables,
//       },
//     );
//     console.log({errors})
//     expect(data).to.not.be.undefined.and.to.not.be.null;
//     expect(data?.updateApplicationStepOneDraft.success).to.be.true;
//   });

//   it("should submit application for step one", async () => {
//     const { data } = await server.executeOperation(
//       {
//         query: SUBMIT_APPLICATION_STEP_ONE_MUTATION,
//         variables: {
//           id: application.id,
//           legalName: "Test",
//           general: {
//             address: "Street 1;21345;City;Germany",
//             city: "Test",
//             postcode: "12345",
//             contactPerson: "qwertz",
//             country: "Germamy",
//             email: "testemail@email.com",
//           },
//           missionStatement: "Our mission is to fulfill our mission",
//           plannedProjects: "Planned is nothing yet",
//           primaryImpactLocation: "Bangladesh",
//           website: "ourwebsite.com",
//           facebook: "facebook.com/blank/404",
//           instagram: "instagram.com/test",
//           other: "other",
//           categories: [Category.cultureAndArt, Category.animalsAndPlants],
//           organisationType: OrganisationType.informalInitiative,
//           mainInterestReason: MainInterestReason.fundraising,
//           fundingType: FundingType.ongoing,
//           acceptFundingFromCorporateSocialResponsibilityPartner: true,
//           plannedFunding: FundingGoal.l,
//           accountUsagePlan:
//             "We want to break free from our own homepage which led to nowhere",
//           links: {
//             website: "Test",
//           },
//         } as ApplicationStepOneSubmitVariables,
//       },
//     );
//     expect(data).to.not.be.undefined.and.to.not.be.null;
//     expect(data?.submitApplicationStepOne.success).to.be.true;
//   });

//   it("should update application draft for step two", async () => {
//     await server.executeOperation({
//       query: APPROVE_APPLICATION_MUTATION,
//       variables: {
//         id: application.id,
//         adminComment: "comment"
//       }
//     });
//     const { data, ...rest } = await server.executeOperation(
//       {
//         query: UPDATE_APPLICATION_STEP_TWO_DRAFT_MUTATION,
//         variables: {
//           id: application.id,
//           integrateDonations: true
//         } as ApplicationStepTwoDraftVariables,
//       },
//     );
//     expect(data).to.not.be.undefined.and.to.not.be.null;
//     expect(data?.updateApplicationStepTwoDraft.success).to.be.true;
//     expect(data?.updateApplicationStepTwoDraft.result.integrateDonations).to.be.true;
//   });

//   it("should submit application for step two", async () => {
//     const result = await server.executeOperation(
//       {
//         query: SUBMIT_APPLICATION_STEP_TWO_MUTATION,
//         variables: {
//           id: application.id,
//           validationMaterial: {
//             links: [{ url: "Test"}],
//             files: [{ id: "TestId", name: "test", type: "test/type", size: 42 }]
//           },
//           organisationalStructure: {
//             text: "Testtext",
//             files: [{ id: "TestOrgStrucId", name: "TestOrgStruc", type: "test/type", size: 24 }]
//           },
//           currentChannelsOfFundraising: "Many",
//           channelsAndStrategies: "Some",
//           integrateDonations: false,
//           partnerOrganisations: "Few",
//           fullTimeWorkers: "Many many many",
//           stakeholderCount: "We have some yeah",
//           organisationNeededResources: OrganisationNeededResources.financialConsultingAndBusinessModelGeneration,
//           possibleAssistenceFromGaia: "We don't need support",
//           firstProjectImpactsAppropriateness: "Ok, sounds cool",
//           firstProjectBeneficiaries: "Yeah, heard of it",
//           firstProjectStakeholderRepresentation: "We represent ourselves",
//           firstProjectRisks: "No risks involved, all cool",
//           firstProjectMilestoneValidation: "We don't need validation",
//           charter: [{ id: "TestCharterId", name: "TestCharter", type: "test/type", size: 36 }],
//           document501c3: [{ id: "TestDocument501c3Id", name: "TestDocument501c3", type: "test/type", size: 48 }],
//         } as ApplicationStepTwoSubmitVariables,
//       },
//     );
//     expect(result.data).to.not.be.undefined.and.to.not.be.null;
//     expect(result.data?.submitApplicationStepTwo.success).to.be.true;
//   });
// });
