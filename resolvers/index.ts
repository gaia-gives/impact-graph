import { ImpactLocationResolver } from "./impactLocationResolver";
import { UserResolver } from "./userResolver";
import { ProjectResolver } from "./projectResolver";
import { OrganisationResolver } from "./organisationResolver";
import { NotificationResolver } from "./notificationResolver";
import { LoginResolver } from "./LoginResolver";
import { RegisterResolver } from "./registerResolver";
import { MeResolver } from "./MeResolver";
import { BankAccountResolver } from "./bankAccountResolver";
import { UploadResolver } from "./uploadResolver";
import { CategoryResolver } from "./categoryResolver";
import { DonationResolver } from "./donationResolver";
import { NewPasswordResolver } from "./NewPasswordResolver";
import { ConfirmUserResolver } from "./ConfirmUserResolver";
import { ApplicationResolver } from "./applicationResolver";
import { NonEmptyArray } from "type-graphql";

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
];

export default resolvers;
