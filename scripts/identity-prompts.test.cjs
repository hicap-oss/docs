// Documentation contracts, not proof of runtime identity isolation.
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const read = p => readFileSync(join(root,p),'utf8');
const identity = read('onboarding-prompts/identity.mdx').replace(/\s+/g,' ');
test('identity requires inherited baseline, trusted sources and capability gates', () => {
  for (const phrase of ['previous .hicap attribution reports', 'server-side membership/authorization',
    'initiating user', 'user tier', 'organization plan, wallet balance, and model tier',
    'current authorization checks', 'expected cardinality', 'retention/deletion',
    'exact-value filtering', 'keep affected identifiers out of outgoing tags',
    'No user-triggered workflows is a valid finding']) assert.ok(identity.includes(phrase), phrase);
});
test('identity verifies tenant isolation and preserved routing', () => {
  for (const phrase of ['immutable per-workflow context', 'never mutate shared-client defaults',
    'concurrent users across two tenants', 'spoofed', 'negative control',
    'snapshot preservation', 'Non-Hicap destinations receive no Hicap identity tags',
    'base dimensions survive unchanged']) assert.ok(identity.includes(phrase),phrase);
});
test('base prompts recognize only the scoped opaque-identity exception', () => {
  for (const name of ['attribution','base-dimensions','tagging-helper','per-call-features']) {
    const text = read('onboarding-prompts/'+name+'.mdx').replace(/\s+/g,' ');
    assert.ok(text.includes('Preserve approved opaque organization/user references'));
    assert.ok(text.includes('do not add new identity fields'));
    assert.ok(text.includes('high-cardinality request/session IDs'));
  }
});
test('four onboarding stages are ordered and identity is registered', () => {
  const routes = ['configure-client','attribution','identity','business-outcomes'];
  for (const page of ['quickstart.mdx','concepts/implement-attribution-with-an-agent.mdx']) {
    const text = read(page);
    const indices = routes.map(route => text.indexOf('Read https://docs.hicap.ai/onboarding-prompts/'+route+' and help me set this up.'));
    assert.ok(indices.every((n,i)=>n>=0 && (i===0 || n>indices[i-1])));
  }
  assert.ok(read('docs.json').includes('"onboarding-prompts/identity"'));
});

test('optional organization and tier are assessed per field without disabling users', () => {
  for (const phrase of ['Assess user, organization, user tier, and trigger independently',
    'A users-only application is valid', 'application-scoped user reference',
    'Do not create a tenant', 'missing or invalid membership must still fail authorization',
    'mark user_tier not applicable', 'mark only that field unresolved',
    'must not suppress independently permitted user attribution',
    'concurrent users with no organization or tier',
    'tenant apps without personal tiers', 'users-only apps with personal tiers',
    'Reject spoofed organization input in users-only apps']) assert.ok(identity.includes(phrase), phrase);
  assert.ok(!identity.includes('If no authoritative user tier exists, report unresolved configuration'));
});
test('synthetic verification cannot silently enable live identifier emission', () => {
  for (const phrase of ['Synthetic local verification is a separate permitted path',
    'explicitly authorizes synthetic identity tests', 'fail-closed mock transport',
    'Production capability gaps do not block this local path',
    'Install the mock before SDK initialization', 'fail if the mock is missing',
    'not be selectable through request input', 'alone must never authorize a live destination',
    'never copies or hashes of real customer data',
    'missing or swapped applicable user/organization tags must fail',
    'optional fields absent by design must pass',
    'test that boundary separately']) assert.ok(identity.includes(phrase), phrase);
});
