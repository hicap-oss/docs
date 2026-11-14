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
