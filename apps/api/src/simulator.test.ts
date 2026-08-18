import { describe, expect, it } from "vitest";
import { RegionalFailoverSimulator } from "./simulator.js";

describe("RegionalFailoverSimulator", () => {
  it("moves deterministic traffic and writer ownership to the secondary region", () => {
    const result = new RegionalFailoverSimulator().runFailoverDrill();
    expect(result.mode).toBe("deterministic-local");
    expect(result.activeRegion).toBe("us-west-2");
    expect(result.status).toBe("failover-active");
    expect(result.regions.find((region) => region.id === "us-west-2")?.databaseRole).toBe("writer");
  });
  it("marks the original primary as recovering without automatically failing traffic back", () => {
    const simulator = new RegionalFailoverSimulator();
    simulator.runFailoverDrill();
    const result = simulator.restorePrimary();
    expect(result.activeRegion).toBe("us-west-2");
    expect(result.status).toBe("recovery-verified");
  });
});
