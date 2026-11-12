// Documentation contract checks; these do not evaluate an agent or make requests.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const load = name => readFileSync(join(root, 'onboarding-prompts', `${name}.mdx`), 'utf8');
const compact = text => text.replace(/\s+/g, ' ');

test('client setup owns migration and preserves existing attribution', () => {
  const prompt = compact(load('configure-client'));
  for (const required of ['https://api.hicap.ai/v1', 'HICAP_API_KEY', 'api-key',
    'OpenAI-compatible client or SDK adapter', 'FINAL outgoing HTTP headers and URL',
    'old inference gateway', 'model IDs', 'capability-discovery']) {
    assert.ok(prompt.includes(required), `Missing ${required}`);
  }
  assert.match(prompt, /no in-scope inference request/i);
  assert.match(prompt, /(?:user|product requirements) authorize/i);
  assert.match(prompt, /Preserve existing attribution headers/i);
  assert.match(prompt, /Do not invent dimensions, add a tagging helper/i);
  assert.match(prompt, /default chat, title generation, tool and background models separately/i);
  assert.match(prompt, /do not claim the application is ready/i);
  assert.doesNotMatch(prompt, /Each (?:model|in-scope Hicap-bound) request sends exactly one x-hicap-tags/);
});

test('attribution preserves mixed routing and requires an existing Hicap client', () => {
  const prompt = compact(load('attribution'));
  assert.match(prompt, /does not migrate inference traffic/i);
  assert.match(prompt, /Keep existing endpoint URLs, credentials, model selection, provider options, routing and fallback behavior unchanged/i);
  assert.match(prompt, /Add tags only to requests already routed to Hicap/i);
  assert.match(prompt, /no identifiable Hicap client or route is configured[\s\S]*skip tagging implementation and its verification/i);
  assert.match(prompt, /configured route with unverified or failing live model access can still be assessed with mocks/i);
  assert.match(prompt, /provenance and intended application\/environment/i);
  assert.match(prompt, /Verify that non-Hicap routes and fallback destinations remain unchanged and receive no Hicap key or attribution header/i);
  assert.match(prompt, /observed and recommended dimension values/i);
  assert.doesNotMatch(prompt, /Route every in-scope model inference path/i);
});

for (const name of ['tagging-helper', 'base-dimensions', 'per-call-features']) {
  test(`${name} applies tags only to existing Hicap routes`, () => {
    const prompt = compact(load(name));
    assert.match(prompt, /Add Hicap tags only to requests already going to Hicap/i);
    assert.match(prompt, /never send its key or tags to other providers/i);
    assert.match(prompt, /If no Hicap client is configured[\s\S]*skip tagging implementation and verification/i);
    assert.match(prompt, /Do not switch providers/i);
    assert.match(prompt, /live access is unverified or failing/i);
    assert.match(prompt, /provenance and intended application\/environment/i);
  });
}

test('guide explains the two tasks and prerequisite', () => {
  const guide = compact(readFileSync(join(root, 'concepts/implement-attribution-with-an-agent.mdx'), 'utf8'));
  assert.match(guide, /Attribution uses existing Hicap routes and does not change your provider, models or fallback routing/i);
  assert.match(guide, /if no Hicap client exists, it reports that prerequisite and points to client setup/i);
});

test('client setup preserves body capabilities and fail-closed evidence', () => {
  const prompt = compact(load('configure-client'));
  for (const term of ['native OpenAI SDK', 'structured-output schemas', 'fail-closed', 'Current-state report requirements:', 'originating application workflow', 'output quality']) assert.ok(prompt.includes(term), term);
});

test('client negative controls do not introduce attribution or require two callers', () => {
  const prompt = compact(load('configure-client'));
  assert.match(prompt, /phase-appropriate negative control/);
  assert.match(prompt, /single caller can use one incorrect expected setting/);
  assert.match(prompt, /Never introduce attribution to satisfy a client-setup test/);
  assert.doesNotMatch(prompt, /negative control that swaps caller attribution/);
});
test('client setup gates API families and live structured-output acceptance', () => {
  const prompt = compact(load('configure-client'));
  for (const required of ['Inventory API families separately', 'explicitly authorized exception, or blocked/unverified', 'Leaving a path unchanged is not an authorized exception', 'strict JSON Schema and tool calling', 'optional fields', 'mark live schema compatibility unverified']) assert.ok(prompt.includes(required), required);
});
test('client setup keeps unverified API families on their existing route', () => {
  const prompt = compact(load('configure-client'));
  assert.match(prompt, /If support is unknown or unsupported, leave that caller's existing route and credentials unchanged/);
  assert.match(prompt, /report it as blocked\/unverified/);
});
for (const name of ['attribution', 'tagging-helper', 'base-dimensions', 'per-call-features']) {
  test(`${name} handles shared steps, single callers and provenance without scope creep`, () => {
    const prompt = compact(load(name));
    for (const required of ['Shared-client acceptance case', 'question rewriting and answering', 'single caller', 'Do not add production workflows, roles or queues', 'pre-existing application defects', 'observed persona, proposed role and emitted convention']) assert.ok(prompt.includes(required), required);
  });
}

test('guide qualifies API compatibility, helper prerequisites and header scope', () => {
  const guide = compact(readFileSync(join(root, 'concepts/implement-attribution-with-an-agent.mdx'), 'utf8'));
  assert.match(guide, /SDK or adapter that supports the API workflows and Hicap capabilities/);
  assert.doesNotMatch(guide, /Any OpenAI-compatible SDK works/);
  assert.match(guide, /Base dimensions requires an existing tagging helper/);
  assert.doesNotMatch(guide, /Each can be handed to an agent on its own/);
  assert.match(guide, /Confirm each Hicap-bound model request sends/);
  assert.doesNotMatch(guide, /Confirm each model request sends/);
});
test('base dimensions assesses six dimensions and handles a missing helper', () => {
  const prompt = compact(load('base-dimensions'));
  assert.match(prompt, /all six dimensions/);
  assert.doesNotMatch(prompt, /all five dimensions/);
  assert.match(prompt, /If the helper is missing[\s\S]*skip base-dimension implementation until it exists/);
});
test('client report assesses existing attribution without recommending dimensions', () => {
  const report = compact(load('configure-client')).split('Current-state report requirements:')[1];
  assert.match(report, /record only existing emitted values/);
  assert.match(report, /Leave dimension recommendations to attribution/);
  assert.doesNotMatch(report, /suggestions separately|candidate system name|proposed role/);
});
for (const name of ['tagging-helper', 'base-dimensions', 'per-call-features']) {
  test(`${name} verifies non-Hicap destinations cannot receive credentials or tags`, () => {
    const prompt = compact(load(name));
    assert.match(prompt, /Capture the final destination and headers of each non-Hicap route and fallback/);
    assert.match(prompt, /assert that they carry no Hicap key or x-hicap-tags header/);
    assert.match(prompt, /do not claim isolation without evidence/);
  });
}
