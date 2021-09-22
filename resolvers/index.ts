import { ImpactLocationResolver } from "./impactLocationResolver";
import { UserResolver } from "./userResolver";
import { ProjectResolver } from "./projectResolver";
import { OrganisationResolver } from "./organisationResolver";
import { LoginResolver } from "./loginResolver";
import { RegisterResolver } from "./registerResolver";
import { MeResolver } from "./meResolver";
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
  LoginResolver,
  RegisterResolver,
  MeResolver,
  NewPasswordResolver,
  ConfirmUserResolver,
  ApplicationResolver,
  ApplicationAdministrationResolver
];

export default resolvers;
