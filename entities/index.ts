import { FileReference } from './fileReference';
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
import { Notification } from "./notification";
import { BankAccount, StripeTransaction } from "./bankAccount";
import { ImpactLocation } from "./impactLocation";
import { Milestone } from "./milestone";
import { Application } from "./application";

const entities = [
  Organisation,
  OrganisationUser,
  User,
  Project,
  ProjectUpdate,
  Reaction,
  Category,
  Token,
  Donation,
  Wallet,
  ProjectStatus,
  Notification,
  BankAccount,
  StripeTransaction,
  ImpactLocation,
  Milestone,
  Application,
  FileReference
];

export default entities;
