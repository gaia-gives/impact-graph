import { AddDonationArgs } from './../project';
import 'mocha';
import { expect, assert } from 'chai';
import { Project } from '../project';
import { mockProjectWithMilestones, mockProjectWithOrganisation } from './utility';
import { MilestoneStatus } from '../milestone';

let project: Project;

describe('test project entity logic', () => {
    beforeEach(() => {
        project = mockProjectWithOrganisation();
    });

    it("should add donation and raise totalDonations by one", () => {
        const params: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);

        expect(project.totalDonations).to.equal(1);
    });

    it("should add donation and raise balance by amount donated", () => {
        const params: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);


        expect(project.balance).to.equal(params.amount);
    });

    it("should add donation and raise organisations totalDonations by one", () => {
        const params: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);

        expect(project.organisation.totalDonors).to.equal(1);
    });

    it("should add donation by different and same users and raise totalDonors accordingly and not count same userId", () => {
        const don1: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };
        const don2: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };
        const don3: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 2
        };
        const don4: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 3
        };

        project.addDonation(don1);
        project.addDonation(don2);
        project.addDonation(don3);

        expect(project.totalDonors).to.equal(2);
    });

    it("should add donation and raise organisations raisedInTotal by amount", () => {
        const params: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);

        expect(project.organisation.raisedInTotal).to.equal(params.amount);
    });

    it("should set milestone to reached when donated the right amount", () => {
        project = mockProjectWithMilestones();
        const params: AddDonationArgs = {
            amount: 25,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);

        expect(project.milestones[0].status, "First milestone to be reached").to.equal(MilestoneStatus.reached);
        expect(project.milestones[1].status, "Second milestone to be reached").to.equal(MilestoneStatus.reached);
        expect(project.milestones[2].status, "Third milestone to be active").to.equal(MilestoneStatus.active);
        expect(project.milestones[3].status,  "First milestone to be reached").to.equal(MilestoneStatus.notReached);
    });

    it("should set next milestone to reached when donated again", () => {
        project = mockProjectWithMilestones();
        const params: AddDonationArgs = {
            amount: 25,
            donationId: 1,
            userId: 1
        };

        const paramsSecondDonation: AddDonationArgs = {
            amount: 5,
            donationId: 2,
            userId: 2
        };

        project.addDonation(params);
        project.addDonation(paramsSecondDonation);

        expect(project.milestones[0].status, "First milestone to be reached").to.equal(MilestoneStatus.reached);
        expect(project.milestones[1].status, "Second milestone to be reached").to.equal(MilestoneStatus.reached);
        expect(project.milestones[2].status, "Third milestone to be reached").to.equal(MilestoneStatus.reached);
        expect(project.milestones[3].status,  "First milestone to be active").to.equal(MilestoneStatus.active);
    });
})