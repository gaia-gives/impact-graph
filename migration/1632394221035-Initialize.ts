import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1632394221035 implements MigrationInterface {
    name = 'Initialize1632394221035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("id" SERIAL NOT NULL, "transactionId" character varying, "transactionNetworkId" integer NOT NULL, "toWalletAddress" character varying NOT NULL, "fromWalletAddress" character varying NOT NULL, "currency" character varying NOT NULL, "anonymous" boolean, "amount" real NOT NULL, "valueEth" real, "valueUsd" real, "priceEth" real, "priceUsd" real, "createdAt" TIMESTAMP NOT NULL, "donationType" character varying, "projectId" integer, "userId" integer, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_status" ("id" SERIAL NOT NULL, "symbol" text NOT NULL, "name" character varying, "description" character varying, CONSTRAINT "UQ_0742348e857789fde8cda81a2ce" UNIQUE ("symbol"), CONSTRAINT "PK_625ed5469429a6b32e34ba9f827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "impact_location" ("id" SERIAL NOT NULL, "name" text, "value" character varying, CONSTRAINT "UQ_6ff3f827299e4c0c57c5c71e364" UNIQUE ("name"), CONSTRAINT "PK_e507c62cc7af22d50672c2ab180" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "milestone" ("id" SERIAL NOT NULL, "threshold" real NOT NULL DEFAULT '0', "status" integer NOT NULL DEFAULT '0', "title" text, "description" text, "mediaLink" text, "projectId" integer NOT NULL, "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_f8372abce331f60ba7b33fe23a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "project_categories_enum" AS ENUM('animalsAndPlants', 'watersAndOceans', 'sustainableAgricultureAndNutrition', 'wasteAndRecycling', 'industryTransformation', 'cultureAndArt', 'protectionOfBasicNeeds', 'educationAndResearch', 'energyAndMobility')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying, "admin" character varying, "description" character varying, "subHeadline" character varying, "organisationId" integer, "creationDate" TIMESTAMP, "coOrdinates" character varying, "image" character varying, "categories" "project_categories_enum" array NOT NULL DEFAULT '{}', "balance" double precision, "stripeAccountId" character varying, "walletAddress" character varying, "verified" boolean NOT NULL, "giveBacks" boolean NOT NULL, "qualityScore" integer, "totalDonations" integer, "totalDonors" integer NOT NULL DEFAULT '0', "totalHearts" integer, "statusId" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_update" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "projectId" integer NOT NULL, "userId" integer NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "isMain" boolean, CONSTRAINT "PK_b4f76307d68c3428aa2d555091f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "application_categories_enum" AS ENUM('animalsAndPlants', 'watersAndOceans', 'sustainableAgricultureAndNutrition', 'wasteAndRecycling', 'industryTransformation', 'cultureAndArt', 'protectionOfBasicNeeds', 'educationAndResearch', 'energyAndMobility')`);
        await queryRunner.query(`CREATE TABLE "application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "legalName" character varying, "general" text, "missionStatement" character varying, "plannedProjects" character varying, "accountUsagePlan" character varying, "organisationType" character varying, "primaryImpactLocation" character varying, "fundingType" character varying, "plannedFunding" character varying, "acceptFundingFromCorporateSocialResponsibilityPartner" boolean, "mainInterestReason" character varying, "categories" "application_categories_enum" array NOT NULL DEFAULT '{}', "links" text, "userId" integer, "applicationState" character varying NOT NULL DEFAULT 'INITIAL', "applicationStep" character varying NOT NULL DEFAULT 'STEP_1', "charter" text NOT NULL DEFAULT '[]', "document501c3" text NOT NULL DEFAULT '[]', "validationMaterial" text DEFAULT '{"links":[],"files":[]}', "organisationalStructure" text DEFAULT '{"text":null,"files":[]}', "lastEdited" TIMESTAMP WITH TIME ZONE DEFAULT now(), "currentChannelsOfFundraising" character varying, "channelsAndStrategies" character varying, "integrateDonations" boolean, "partnerOrganisations" character varying, "fullTimeWorkers" character varying, "stakeholderCount" character varying, "organisationNeededResources" character varying, "possibleAssistenceFromGaia" character varying, "firstProjectImpactsAppropriateness" character varying, "firstProjectBeneficiaries" character varying, "firstProjectStakeholderRepresentation" character varying, "firstProjectRisks" character varying, "firstProjectMilestoneValidation" character varying, "readByAdmin" boolean DEFAULT false, "adminCommentStepOne" character varying, "adminCommentStepTwo" character varying, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_globalrole_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "newEmail" character varying, "firstName" character varying, "lastName" character varying, "name" character varying, "walletAddress" character varying, "password" character varying, "avatar" character varying, "url" character varying, "location" character varying, "loginType" character varying NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "globalRole" "user_globalrole_enum" NOT NULL DEFAULT 'user', "segmentIdentified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_efbd1135797e451d834bcf88cd2" UNIQUE ("walletAddress"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "descriptionHeadline" character varying, "description" character varying, "mediaLink" character varying, "totalDonors" integer NOT NULL DEFAULT '0', "raisedInTotal" real NOT NULL DEFAULT '0', CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank_account" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "productId" character varying NOT NULL, "bankName" character varying NOT NULL, "accountHolderName" character varying NOT NULL, "accountHolderType" character varying NOT NULL, "country" character varying NOT NULL, "currency" character varying NOT NULL, "accountId" character varying NOT NULL, "fingerprint" character varying NOT NULL, "last4" character varying NOT NULL, "routingNumber" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stripe_transaction" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "status" character varying NOT NULL, "sessionId" character varying, "donorCustomerId" character varying, "donorName" character varying, "donorEmail" character varying, "createdAt" TIMESTAMP NOT NULL, "amount" double precision, "donateToGiveth" boolean, "anonymous" boolean NOT NULL DEFAULT false, "currency" character varying NOT NULL, CONSTRAINT "PK_845103cb14fe333f976df08d57e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_impact_locations_impact_location" ("projectId" integer NOT NULL, "impactLocationId" integer NOT NULL, CONSTRAINT "PK_b8ce353d4e521b3bc487cde329a" PRIMARY KEY ("projectId", "impactLocationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29f88358941c577f669cf7ad1a" ON "project_impact_locations_impact_location" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6fe3101917558140547048b4b3" ON "project_impact_locations_impact_location" ("impactLocationId") `);
        await queryRunner.query(`CREATE TABLE "project_users_user" ("projectId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_198c78e84c3bcdb0dc182e6d1e0" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9666c6dcd769c698bed4aa4bf5" ON "project_users_user" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f8300efd87679e1e21532be980" ON "project_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_projects_project" ("userId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_26a180af1ec7a8550f5c374fcd8" PRIMARY KEY ("userId", "projectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79daf0d2be103f4c30c77ddd6b" ON "user_projects_project" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_936561888bfd63d01c79fe415c" ON "user_projects_project" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "organisation_users_user" ("organisationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_eac8f9e5df621f9316babe31ff0" PRIMARY KEY ("organisationId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3fd33a53717959eaca3284edc9" ON "organisation_users_user" ("organisationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_261fa3d243508bfc94e45405e2" ON "organisation_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_284a4db7a442587ef3e3c44ff44" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_063499388657e648418470a439a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milestone" ADD CONSTRAINT "FK_edc28a2e0442554afe5eef2bdcb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_b6d55aff9b16e061712260da686" FOREIGN KEY ("statusId") REFERENCES "project_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_impact_locations_impact_location" ADD CONSTRAINT "FK_29f88358941c577f669cf7ad1a3" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_impact_locations_impact_location" ADD CONSTRAINT "FK_6fe3101917558140547048b4b30" FOREIGN KEY ("impactLocationId") REFERENCES "impact_location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users_user" ADD CONSTRAINT "FK_9666c6dcd769c698bed4aa4bf55" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users_user" ADD CONSTRAINT "FK_f8300efd87679e1e21532be9808" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" ADD CONSTRAINT "FK_936561888bfd63d01c79fe415c3" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_3fd33a53717959eaca3284edc98" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_261fa3d243508bfc94e45405e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_261fa3d243508bfc94e45405e23"`);
        await queryRunner.query(`ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_3fd33a53717959eaca3284edc98"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_936561888bfd63d01c79fe415c3"`);
        await queryRunner.query(`ALTER TABLE "user_projects_project" DROP CONSTRAINT "FK_79daf0d2be103f4c30c77ddd6be"`);
        await queryRunner.query(`ALTER TABLE "project_users_user" DROP CONSTRAINT "FK_f8300efd87679e1e21532be9808"`);
        await queryRunner.query(`ALTER TABLE "project_users_user" DROP CONSTRAINT "FK_9666c6dcd769c698bed4aa4bf55"`);
        await queryRunner.query(`ALTER TABLE "project_impact_locations_impact_location" DROP CONSTRAINT "FK_6fe3101917558140547048b4b30"`);
        await queryRunner.query(`ALTER TABLE "project_impact_locations_impact_location" DROP CONSTRAINT "FK_29f88358941c577f669cf7ad1a3"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_b6d55aff9b16e061712260da686"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d"`);
        await queryRunner.query(`ALTER TABLE "milestone" DROP CONSTRAINT "FK_edc28a2e0442554afe5eef2bdcb"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_063499388657e648418470a439a"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_284a4db7a442587ef3e3c44ff44"`);
        await queryRunner.query(`DROP INDEX "IDX_261fa3d243508bfc94e45405e2"`);
        await queryRunner.query(`DROP INDEX "IDX_3fd33a53717959eaca3284edc9"`);
        await queryRunner.query(`DROP TABLE "organisation_users_user"`);
        await queryRunner.query(`DROP INDEX "IDX_936561888bfd63d01c79fe415c"`);
        await queryRunner.query(`DROP INDEX "IDX_79daf0d2be103f4c30c77ddd6b"`);
        await queryRunner.query(`DROP TABLE "user_projects_project"`);
        await queryRunner.query(`DROP INDEX "IDX_f8300efd87679e1e21532be980"`);
        await queryRunner.query(`DROP INDEX "IDX_9666c6dcd769c698bed4aa4bf5"`);
        await queryRunner.query(`DROP TABLE "project_users_user"`);
        await queryRunner.query(`DROP INDEX "IDX_6fe3101917558140547048b4b3"`);
        await queryRunner.query(`DROP INDEX "IDX_29f88358941c577f669cf7ad1a"`);
        await queryRunner.query(`DROP TABLE "project_impact_locations_impact_location"`);
        await queryRunner.query(`DROP TABLE "stripe_transaction"`);
        await queryRunner.query(`DROP TABLE "bank_account"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_globalrole_enum"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TYPE "application_categories_enum"`);
        await queryRunner.query(`DROP TABLE "project_update"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "project_categories_enum"`);
        await queryRunner.query(`DROP TABLE "milestone"`);
        await queryRunner.query(`DROP TABLE "impact_location"`);
        await queryRunner.query(`DROP TABLE "project_status"`);
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
