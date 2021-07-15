import { Organisation } from "./organisation";
import { OrganisationUser } from "./organisationUser";
import { User } from "./user";
import { Project, ProjectUpdate } from "./project";
import { Reaction } from "./reaction";
import { Category } from "./category";
import { Token } from "./token";
import { Donation } from "./donation";
import { Wallet } from "./wallet";
import { ProjectStatus } from "./projectStatus";
import Notification from "./notification";
import { BankAccount, StripeTransaction } from "./bankAccount";
import { ImpactLocation } from "./impactLocation";
import { Milestone } from "./milestone";
import { Application } from "./application";

export const entities: any = [
  Organisation,
  OrganisationUser,
  User,
  Project,
  Notification,
  BankAccount,
  StripeTransaction,
  Category,
  ProjectUpdate,
  Reaction,
  Donation,
  Token,
  Wallet,
  ProjectStatus,
  ImpactLocation,
  Milestone,
  Application,
];
