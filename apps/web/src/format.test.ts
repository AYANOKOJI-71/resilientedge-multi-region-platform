import { describe, expect, it } from "vitest";
import { stateLabel } from "./format";

describe("resilience formatting", () => {
  it("renders hyphenated operational state labels", () => {
    expect(stateLabel("recovery-verified")).toBe("Recovery Verified");
  });
});
