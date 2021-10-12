import { assert, expect } from "chai";
import { randomUUID } from "crypto";
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
        application.assertCanSubmit(ApplicationStep.STEP_2);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should not be able to submit if in unsubmittable state ACCEPTED", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.ACCEPTED;

    assert.throws(
      () => {
        application.assertCanSubmit(ApplicationStep.STEP_1);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should not be able to submit if in unsubmittable state REJECTED", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.REJECTED;

    assert.throws(
      () => {
        application.assertCanSubmit(ApplicationStep.STEP_1);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should not be able to submit if in unsubmittable state PENDING", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.PENDING;

    assert.throws(
      () => {
        application.assertCanSubmit(ApplicationStep.STEP_1);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
    );
  });

  it("should be able to submit if conditions met", () => {
    application = new Application();
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.DRAFT;

    assert.doesNotThrow(
      () => {
        application.assertCanSubmit(ApplicationStep.STEP_1);
      },
      Error,
      "Cannot submit, invalid application state for submission!"
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

    expect(application.adminCommentStepOne).to.not.be.null.and.to.not.be
      .undefined;
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

    expect(application.adminCommentStepTwo).to.not.be.null.and.to.not.be
      .undefined;
    expect(application.adminCommentStepOne).to.be.undefined;
    expect(application.adminCommentStepTwo).to.equal("Test");
  });

  it("should create organisation after approval of step 2", () => {
    application = new Application();
    const admin = new User();
    admin.globalRole = GlobalRole.ADMIN;
    const applicationCreator = new User();
    application.user = applicationCreator;
    application.legalName = "Testorga";
    application.applicationStep = ApplicationStep.STEP_2;
    application.applicationState = ApplicationState.ACCEPTED;

    const result = application.createOrganisationThroughApproval();

    expect(result).to.not.be.null.and.to.not.be.undefined;
    expect(result.title).to.equal(application.legalName);
  });

  it("should not create organisation if not in STEP_2", () => {
    application = new Application();
    const admin = new User();
    admin.globalRole = GlobalRole.ADMIN;
    const applicationCreator = new User();
    application.user = applicationCreator;
    application.legalName = "Testorga";
    application.applicationStep = ApplicationStep.STEP_1;
    application.applicationState = ApplicationState.ACCEPTED;

    assert.throws(
      () => application.createOrganisationThroughApproval(),
      Error,
      "Cannot create organisation without beforehand approval!"
    );
  });

  it("should not create organisation if not in ACCEPTED state", () => {
    application = new Application();
    const admin = new User();
    admin.globalRole = GlobalRole.ADMIN;
    const applicationCreator = new User();
    application.user = applicationCreator;
    application.legalName = "Testorga";
    application.applicationStep = ApplicationStep.STEP_2;
    application.applicationState = ApplicationState.PENDING;

    assert.throws(
      () => application.createOrganisationThroughApproval(),
      Error,
      "Cannot create organisation without beforehand approval!"
    );
  });
});
