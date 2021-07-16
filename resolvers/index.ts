import { ImpactLocationResolver } from "./impactLocationResolver";
import { UserResolver } from "./userResolver";
import { ProjectResolver } from "./projectResolver";
import { OrganisationResolver } from "./organisationResolver";
import { NotificationResolver } from "./notificationResolver";
import { LoginResolver } from "../user/LoginResolver";
import { RegisterResolver } from "../user/register/RegisterResolver";
import { MeResolver } from "../user/MeResolver";
import { BankAccountResolver } from "./bankAccountResolver";
import { UploadResolver } from "./uploadResolver";
import { CategoryResolver } from "./categoryResolver";
import { DonationResolver } from "./donationResolver";
import { NewPasswordResolver } from "../user/NewPasswordResolver";
import { ConfirmUserResolver } from "../user/ConfirmUserResolver";
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
