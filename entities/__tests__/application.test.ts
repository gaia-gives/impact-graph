import { assert, expect } from "chai";
import { Application, ApplicationState, ApplicationStep } from "../application";
import { GlobalRole, User } from "../user";

let application: Application;

describe("application tests", () => {
  it("should not be able to submit if different step", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.DRAFT;

    assert.throws(
      () => {
        application.updateApplicationStepTwo({});
      },
      Error,
      "Cannot update, invalid application state for update!"
    );
  });

  it("should not be able to submit if in unsubmittable state ACCEPTED", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.ACCEPTED;

    assert.throws(
      () => {
        application.updateApplicationStepOne({}, []);
      },
      Error,
      "Cannot update, invalid application state for update!"
    );
  });

  it("should not be able to submit if in unsubmittable state REJECTED", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.REJECTED;

    assert.throws(
      () => {
        application.updateApplicationStepOne({}, []);
      },
      Error,
      "Cannot update, invalid application state for update!"
    );
  });

  it("should not be able to submit if in unsubmittable state PENDING", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.PENDING;

    assert.throws(
      () => {
        application.updateApplicationStepOne({}, []);
      },
      Error,
      "Cannot update, invalid application state for update!"
    );
  });

  it("should be able to submit if conditions met", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.DRAFT;

    assert.doesNotThrow(
      () => {
        application.updateApplicationStepOne({}, []);
      },
      Error,
      "Cannot update, invalid application state for update!"
    );
  });

  it("should set read", () => {
    application = new Application();
    application.setRead();

    expect(application.readByAdmin).to.be.true;
  });

  it("should set submitted if possible", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.DRAFT;

    application.setSubmitted(ApplicationStep.STEP_1);

    expect(application.applicationState).to.equal(ApplicationState.PENDING);
  });

  it("should not set submitted if not possible and throw error", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.ACCEPTED;

    assert.throws(
      () => {
        application.setSubmitted(ApplicationStep.STEP_1);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should not set submitted if not possible and throw error", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.DRAFT;

    assert.throws(
      () => {
        application.setSubmitted(ApplicationStep.STEP_2);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should update admin comment of step 1", () => {
    application = new Application();
    const user = new User();
    user.globalRole = GlobalRole.ADMIN;
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.ACCEPTED;

    application.updateAdminComment("Test");

    expect(application.adminCommentStepOne).to.not.be.null.and.to.not.be.undefined;
    expect(application.adminCommentStepTwo).to.be.undefined;
    expect(application.adminCommentStepOne).to.equal("Test");
  });

  it("should update admin comment of step 2", () => {
    application = new Application();
    const user = new User();
    user.globalRole = GlobalRole.ADMIN;
    application.applicationStep = ApplicationStep.STEP_2;
    application.applicationState = ApplicationState.REJECTED;

    application.updateAdminComment("Test");

    expect(application.adminCommentStepTwo).to.not.be.null.and.to.not.be.undefined;
    expect(application.adminCommentStepOne).to.be.undefined;
    expect(application.adminCommentStepTwo).to.equal("Test");
  });

});
