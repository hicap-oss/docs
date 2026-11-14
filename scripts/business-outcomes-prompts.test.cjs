// Documentation contracts; these do not prove coding-agent behavior or measured ROI.
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const read = path => readFileSync(join(root,path),'utf8');
const prompt = read('onboarding-prompts/business-outcomes.mdx').replace(/\s+/g,' ');
const requirePhrases = phrases => {for(const phrase of phrases) assert.ok(prompt.includes(phrase),phrase);};
test('business design inherits optional identity and discovers source-backed questions', () => {
  requirePhrases(['current .hicap base-attribution and identity reports', 'actual emitted values',
    'User, organization, and tier context are independently optional',
    'A users-only app does not need customer_org', 'does not need user_tier',
    'Not applicable is not an integration failure', 'Discover candidate questions from the application',
    'Inventory authoritative bounded business fields', 'include, reject, or defer',
    'business question -> outcome/ROI metric', 'request-time availability']);
});
test('shared organization plan does not become or depend on a personal tier', () => {
  requirePhrases(['Assess a shared organization plan separately from personal user tier',
    'propose organization_plan', 'not a reason to discard plan-based analysis',
    'Users-only apps may instead have a personal plan, or no plan at all',
    'never invent organizations or tiers for segment predicates']);
});
test('segments preserve scope, optional fields and overlap semantics', () => {
  requirePhrases(['AND/OR grouping', 'missing-value behavior', 'supported platform schema',
    'Segments select traffic; they are not extra tags', 'Do not sum overlapping',
    'deduplication rule', 'Users-only segments must not require an organization',
    'segments unrelated to tier must still match when tier is not applicable',
    'without fabricating personal user tiers', 'saved platform segments']);
});
test('cost association verifies contracts and keeps references out of tags', () => {
  requirePhrases(['Inspect supported cost and correlation sources', 'usage.cost',
    'estimated, response-reported, or reconciled billed cost',
    'Do not assume these fields exist', 'Do not make a live call merely to discover them',
    'Scope it to the authorized user/resource, plus tenant when present',
    'Keep references and costs in the application record, not tag values',
    'successful response ID alone does not prove complete billable-attempt coverage',
    'durable, timestamped events with stable event identity',
    'first/repeated/revoked-approval behavior', 'Proposal-only observation windows are not approved']);
});
test('outcomes remain conditional and ROI requires evidence', () => {
  requirePhrases(['A future outcome cannot be tagged', 'Cost per completion is an efficiency metric, not ROI',
    'Missing data is unavailable, not zero', 'do not divide by zero',
    'Correlation does not establish causal impact', 'New outcome-event instrumentation is conditional',
    'negative control', 'Show the exact report path']);
});
test('overview links retain the four-stage workflow', () => {
  for(const page of ['quickstart.mdx','concepts/implement-attribution-with-an-agent.mdx']) {
    const text=read(page);
    assert.ok(text.includes('Read https://docs.hicap.ai/onboarding-prompts/business-outcomes and help me set this up.'));
    assert.ok(text.includes('custom dimensions'));
    assert.ok(text.includes('Users-only apps'));
  }
});
