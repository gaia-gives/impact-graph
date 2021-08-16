import { ImpactLocationResolver } from "./impactLocationResolver";
import { UserResolver } from "./userResolver";
import { ProjectResolver } from "./projectResolver";
import { OrganisationResolver } from "./organisationResolver";
import { NotificationResolver } from "./notificationResolver";
import { LoginResolver } from "./loginResolver";
import { RegisterResolver } from "./registerResolver";
import { MeResolver } from "./meResolver";
import { BankAccountResolver } from "./bankAccountResolver";
import { UploadResolver } from "./uploadResolver";
import { CategoryResolver } from "./categoryResolver";
import { DonationResolver } from "./donationResolver";
import { NewPasswordResolver } from "./newPasswordResolver";
import { ConfirmUserResolver } from "./confirmUserResolver";
import { ApplicationResolver } from "./applicationResolver";
import { NonEmptyArray } from "type-graphql";
import { ApplicationAdministrationResolver } from "./applicationAdministrationResolver";

const resolvers: NonEmptyArray<Function> = [
  ImpactLocationResolver,
  UserResolver,
  ProjectResolver,
  OrganisationResolver,
  NotificationResolver,
  LoginResolver,
  RegisterResolver,
  MeResolver,
  BankAccountResolver,
  UploadResolver,
  CategoryResolver,
  DonationResolver,
  NewPasswordResolver,
  ConfirmUserResolver,
  ApplicationResolver,
  ApplicationAdministrationResolver
];

export default resolvers;
