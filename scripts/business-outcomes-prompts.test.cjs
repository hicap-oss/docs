// Documentation requirements, not proof of measured business impact.
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const read = path => readFileSync(join(root,path),'utf8');
const prompt = read('onboarding-prompts/business-outcomes.mdx').replace(/\s+/g,' ');
test('business design inherits base and identity before adding dimensions', () => {
  for (const phrase of ['current .hicap base-attribution and identity reports',
    'actual emitted values', 'do not rename, overwrite, or duplicate',
    'Identity is optional', 'affected questions unanswerable',
    'business question -> outcome/ROI metric', 'necessary custom dimensions',
    'Avoid synonyms for feature, operation, domain, user tier, or customer organization',
    'request-time availability', 'A future outcome cannot be tagged']) assert.ok(prompt.includes(phrase),phrase);
});
test('segments have explicit semantics, overlap and configuration evidence', () => {
  for (const phrase of ['AND/OR grouping', 'missing-value behavior',
    'positive/negative examples', 'supported platform schema',
    'Segments select traffic; they are not extra tags',
    'Do not sum overlapping segment costs', 'deduplication rule',
    'saved platform segment', 'positive, negative, missing-dimension, and overlapping fixtures'])
    assert.ok(prompt.includes(phrase),phrase);
});
test('ROI requires evidenced benefits and instrumentation stays conditional', () => {
  for (const phrase of ['Cost per completion is an efficiency metric, not ROI',
    'baseline/comparison', 'Missing data is unavailable, not zero',
    'do not divide by zero', 'Correlation does not establish causal impact',
    'New outcome-event instrumentation is conditional', 'Do not introduce new identity']) assert.ok(prompt.includes(phrase),phrase);
});
test('verification preserves baseline and catches incorrect caller context', () => {
  for (const phrase of ['Assert base and identity values are preserved',
    'non-Hicap destinations receive no Hicap tags', 'independent workflow evidence',
    'negative control', 'swapped or missing business context',
    'Show the exact report path']) assert.ok(prompt.includes(phrase),phrase);
  for (const page of ['quickstart.mdx','concepts/implement-attribution-with-an-agent.mdx']) {
    const text=read(page);
    assert.ok(text.includes('Read https://docs.hicap.ai/onboarding-prompts/business-outcomes and help me set this up.'));
    assert.ok(text.includes('custom dimensions and segments'));
  }
});
