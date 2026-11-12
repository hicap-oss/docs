// Checks maintained standalone prompts, not obsolete inline copies or agent reliability.
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const names = ['attribution', 'tagging-helper', 'base-dimensions', 'per-call-features'];
for (const name of names) {
  const text = readFileSync(join(root, 'onboarding-prompts', `${name}.mdx`), 'utf8');
  const compact = text.replace(/\s+/g, ' ');
  test(`${name}: dimensions, caller identity, negative control and evidence levels`, () => {
    assert.equal((text.match(/^````/gm) || []).length, 2);
    for (const term of ['https://api.hicap.ai/v1', 'api-key', 'HICAP_API_KEY', 'x-hicap-tags', 'agent', 'env', 'system', 'feature', 'domain', 'operation =', 'originating application workflow', 'not from the emitted tags', 'swapping two callers', 'negative control', 'fail-closed', 'Current-state report requirements:', 'source configured', 'fresh live response verified', 'recorded Hicap attribution verified', 'agent_type', 'agent_id']) assert.ok(compact.includes(term), `${name}: missing ${term}`);
    assert.match(compact, /preserv.*existing reports|preserv.*existing.*notes/i);
  });
}
test('guide links resolve and includes operation in six-dimension baseline', () => {
  const guide = readFileSync(join(root, 'concepts/implement-attribution-with-an-agent.mdx'), 'utf8');
  assert.match(guide, /six.*dimensions/);
  assert.match(guide, /operation/);
  for (const [, target] of guide.matchAll(/(?:\]\(|href=")(\/[^\s)"#]+)/g)) assert.ok(existsSync(join(root, `${target.slice(1)}.mdx`)), target);
});
