import { Organisation } from "./organisation";
import { User } from "./user";
import { Project, ProjectUpdate } from "./project";
import { ProjectStatus } from "./projectStatus";
import { BankAccount, StripeTransaction } from "./bankAccount";
import { ImpactLocation } from "./impactLocation";
import { Milestone } from "./milestone";
import { Application } from "./application";
import { Donation } from "./donation";

const entities = [
  Organisation,
  User,
  Project,
  ProjectUpdate,
  Donation,
  ProjectStatus,
  BankAccount,
  StripeTransaction,
  ImpactLocation,
  Milestone,
  Application,
];

export default entities;
