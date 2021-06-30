import { assert, expect } from "chai";
import { Organisation } from "./../organisation";
import "mocha";
import { mockOrganisation } from "./utility";

let organisation: Organisation;

describe("test organisation entity logic", () => {
  beforeEach(() => {
    organisation = mockOrganisation();
  });

  it("should add donation", () => {
    organisation.addDonation(100);

    expect(organisation.raisedInTotal).to.equal(100);
    expect(organisation.totalDonors).to.equal(1);
  });

  it("should add multiple donation", () => {
    organisation.addDonation(100);
    organisation.addDonation(100);
    organisation.addDonation(300);

    expect(organisation.raisedInTotal).to.equal(500);
    expect(organisation.totalDonors).to.equal(3);
  });

  it("should reject zero donation amount", () => {
    assert.throws(() => { organisation.addDonation(0) }, Error, "Cannot add 0 or less than 0 donation amount");
  });

  it("should reject negative donation amount", () => {
    assert.throws(() => { organisation.addDonation(-100) }, Error, "Cannot add 0 or less than 0 donation amount");
  });
});
