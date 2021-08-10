import { assert, expect} from 'chai';
import { Application, ApplicationState, ApplicationStep } from "../application";

let application: Application;

describe("application tests", () => {
    it ("should not be able to submit if different step", () => {
        application = new Application();
        application.applicationStep = ApplicationStep.STEP_1;
        application.applicationState = ApplicationState.DRAFT;

        assert.throws(() => { application.assertCanSubmit(ApplicationStep.STEP_2) }, Error, "Cannot submit, invalid application state for submission");
    });

    it ("should not be able to submit if in unsubmittable state ACCEPTED", () => {
        application = new Application();
        application.applicationStep = ApplicationStep.STEP_1;
        application.applicationState = ApplicationState.ACCEPTED;

        assert.throws(() => { application.assertCanSubmit(ApplicationStep.STEP_2) }, Error, "Cannot submit, invalid application state for submission");
    });

    it ("should not be able to submit if in unsubmittable state REJECTED", () => {
        application = new Application();
        application.applicationStep = ApplicationStep.STEP_1;
        application.applicationState = ApplicationState.REJECTED;

        assert.throws(() => { application.assertCanSubmit(ApplicationStep.STEP_2) }, Error, "Cannot submit, invalid application state for submission");
    });

    it ("should not be able to submit if in unsubmittable state PENDING", () => {
        application = new Application();
        application.applicationStep = ApplicationStep.STEP_1;
        application.applicationState = ApplicationState.PENDING;

        assert.throws(() => { application.assertCanSubmit(ApplicationStep.STEP_2) }, Error, "Cannot submit, invalid application state for submission");
    });

    it ("should be able to submit if conditions met", () => {
        application = new Application();
        application.applicationStep = ApplicationStep.STEP_1;
        application.applicationState = ApplicationState.DRAFT;

        assert.doesNotThrow(() => { application.assertCanSubmit(ApplicationStep.STEP_1) }, Error, "Cannot submit, invalid application state for submission");
    });
});