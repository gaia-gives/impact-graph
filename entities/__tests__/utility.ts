import { Project } from '../project';
import { Organisation } from './../organisation';

const mockOrganisation = (): Organisation => {
    let organisation: Organisation;
    organisation = new Organisation();
    organisation.projects = [],
    organisation.title = "Test organisation",
    organisation.raisedInTotal = 0,
    organisation.totalDonors = 0,
    organisation.users = [],
    organisation.description = "Test description",
    organisation.mediaLink = "Test media link";
    return organisation;
}

const mockProjectWithOrganisation = (): Project => {
    let project: Project;
    project = new Project();
    project.balance=0;
    project.organisation = mockOrganisation();
    project.organisationId = 1;
    project.qualityScore = 0;
    project.reactions = [];
    project.slug = "test-project";
    project.users = [];
    project.title = "Test project";
    project.verified = true;
    project.image = "https://images.unsplash.com/photo-1564648351416-3eec9f3e85de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80";
    project.impactLocations = [];
    project.categories = [];
    project.coOrdinates = "";
    project.totalDonations = 0;
    project.totalHearts = 0;
    return project;
}

export { mockOrganisation, mockProjectWithOrganisation }