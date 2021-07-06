import { Milestone, MilestoneStatus } from './../milestone';
import 'mocha';
import { assert, expect } from 'chai';
import { mockMilestone, mockProjectWithOrganisation } from './utility';

let milestone: Milestone;

describe('test milestone entity tests', () => {
    beforeEach(() => {
        milestone = mockMilestone(mockProjectWithOrganisation(), 1, 100);
    });

    it("should set status to active", () => {
        milestone.setActive();

        expect(milestone.status).to.equal(MilestoneStatus.active);
    });

    it("should set active status to reached", () => {
        milestone.contributeToMilestone(150);

        expect(milestone.status).to.equal(MilestoneStatus.reached);
    });

    it("should not set already reached goal to active", () => {
        milestone.status = MilestoneStatus.reached;

        assert.throws(() => { milestone.setActive() }, Error, "Cannot set already reached milestone back to active!");
    });

    it("should not set active to reached if goal not reached", () => {
        milestone.setActive();
        milestone.contributeToMilestone(50);

        expect(milestone.status).to.equal(MilestoneStatus.active);
    });
});