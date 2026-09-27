import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { registerSchema, estimateSchema, requestSchema } from "@/lib/validators";

describe("validators", () => {
  it("accepts a valid registration", () => {
    const r = registerSchema.safeParse({ name: "Amina", email: "a@test.com", password: "secret1", country: "Kenya", language: "en", role: "patient" });
    assert.equal(r.success, true);
  });
  it("rejects a short password", () => {
    const r = registerSchema.safeParse({ name: "A", email: "bad", password: "x" });
    assert.equal(r.success, false);
  });
  it("rejects estimate where min > max", () => {
    const r = estimateSchema.safeParse({ requestId: "r", treatmentId: "t", hospitalId: "h", minCost: 9, maxCost: 5 });
    assert.equal(r.success, false);
  });
  it("accepts all 5 request types", () => {
    for (const type of ["translator", "coordinator", "appointment", "cost_estimate", "support"]) {
      const r = requestSchema.safeParse({ type, message: "Need help please" });
      assert.equal(r.success, true);
    }
  });
});
