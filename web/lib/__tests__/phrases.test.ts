import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { translatePhrase, phraseList } from "@/lib/phrases";
import { parseList } from "@/lib/format";

describe("phrases + format", () => {
  it("translates a known phrase to FR/SW/AR", () => {
    const hit = translatePhrase("Where is the pharmacy?");
    assert.ok(hit);
    assert.ok(hit!.fr.length > 0 && hit!.sw.length > 0 && hit!.ar.length > 0);
  });
  it("returns null for unknown phrase", () => {
    assert.equal(translatePhrase("xyzzy unknown"), null);
  });
  it("glossary has at least 5 phrases", () => {
    assert.ok(phraseList().length >= 5);
  });
  it("parseList handles JSON and garbage", () => {
    assert.deepEqual(parseList('["A","B"]'), ["A", "B"]);
    assert.deepEqual(parseList(""), []);
    assert.deepEqual(parseList("Cardiology"), ["Cardiology"]);
  });
});
