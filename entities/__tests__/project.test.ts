import { AddDonationArgs } from './../project';
import 'mocha';
import { expect, assert } from 'chai';
import { Project } from '../project';
import { mockProjectWithOrganisation } from './utility';

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

    it("should add donation and raise organisations totalDonors by one", () => {
        const params: AddDonationArgs = {
            amount: 100,
            donationId: 1,
            userId: 1
        };

        project.addDonation(params);

        expect(project.organisation.totalDonors).to.equal(1);
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
})