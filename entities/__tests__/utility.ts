import { Milestone, MilestoneStatus } from "./../milestone";
import { Project } from "../project";
import { Organisation } from "./../organisation";

const mockOrganisation = (): Organisation => {
  const organisation: Organisation = new Organisation();
  organisation.projects = [],
  organisation.title = "Test organisation",
  organisation.raisedInTotal = 0,
  organisation.totalDonors = 0,
  organisation.users = [],
  organisation.description = "Test description",
  organisation.mediaLink = "Test media link";
  return organisation;
};

const mockProjectWithOrganisation = (): Project => {
  const project: Project = new Project();
  project.balance = 0;
  project.organisation = mockOrganisation();
  project.organisationId = 1;
  project.qualityScore = 0;
  project.reactions = [];
  project.slug = "test-project";
  project.users = [];
  project.title = "Test project";
  project.verified = true;
  project.image =
    "https://images.unsplash.com/photo-1564648351416-3eec9f3e85de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80";
  project.impactLocations = [];
  project.categories = [];
  project.coOrdinates = "";
  project.totalDonations = 0;
  project.totalHearts = 0;
  project.milestones = [];
  project.organisation.projects.push(project);
  return project;
};

const mockMilestone = (
  project: Project,
  projectId: number,
  threshold: number
): Milestone => {
  const milestone: Milestone = new Milestone();
  milestone.project = project;
  milestone.projectId = projectId;
  milestone.threshold = threshold;
  milestone.description = "Test description for milestone " + milestone.id;
  milestone.mediaLink = "Test media link " + milestone.id;
  milestone.status = MilestoneStatus.notReached;

  return milestone;
};

const mockProjectWithMilestones = (): Project => {
  const project: Project = mockProjectWithOrganisation();
  project.milestones.push(
    mockMilestone(project, 1, 10),
    mockMilestone(project, 1, 20),
    mockMilestone(project, 1, 30),
    mockMilestone(project, 1, 40)
  );
  return project;
};

export {
  mockOrganisation,
  mockProjectWithOrganisation,
  mockMilestone,
  mockProjectWithMilestones,
};
