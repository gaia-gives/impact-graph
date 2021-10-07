import { registerEnumType } from "type-graphql";

export enum ProjectStatus {
    DRAFT = 'DRAFT',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED'
}

registerEnumType(ProjectStatus, {
    name: "ProjectStatus",
    description: "The status of a project",
  });