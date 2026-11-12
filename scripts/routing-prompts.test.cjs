// Routing contract checks; these do not evaluate an agent or make gateway requests.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

for (const name of ['attribution', 'configure-client']) {
  test(`${name} requires explicit Hicap routing and verification`, () => {
    const prompt = readFileSync(join(__dirname, '..', 'onboarding-prompts', `${name}.mdx`), 'utf8');
    for (const required of ['https://api.hicap.ai/v1', 'HICAP_API_KEY', 'api-key',
      'OpenAI-compatible client or SDK adapter', 'FINAL outgoing HTTP headers and URL',
      'old inference gateway', 'model IDs', 'capability-discovery']) {
      assert.ok(prompt.includes(required), `Missing ${required}`);
    }
    assert.match(prompt, /silent(?:ly)?[\s\S]{0,160}(?:fallback|fall back|bypass)|(?:fallback|fall back)[\s\S]{0,160}silent/i);
    assert.match(prompt, /(?:user|product requirements) authorize/i);
    assert.match(prompt, /report[\s\S]{0,160}(?:incomplete|affected workflow)/i);
  });
}
