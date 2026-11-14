const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const root = join(__dirname, '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const spec = JSON.parse(read('openapi.json'));

test('chat response distinguishes JSON and event streams', () => {
  const content = spec.paths['/chat/completions'].post.responses['200'].content;
  assert.equal(content['application/json'].schema.$ref, '#/components/schemas/createChatCompletionResponse');
  assert.equal(content['text/event-stream'].schema.type, 'string');
});

test('unverified seed ranges are not represented as rounded integers', () => {
  const schemas = spec.components.schemas;
  const seeds = [schemas.createCompletionRequest.properties.seed, schemas.createChatCompletionRequest.allOf[1].properties.seed];
  for (const seed of seeds) {
    assert.equal(seed.minimum, undefined);
    assert.equal(seed.maximum, undefined);
    assert.match(seed.description, /range.*not been verified/i);
  }
});

test('chat example stays minimal and provider-specific behavior is qualified', () => {
  const post = spec.paths['/chat/completions'].post;
  const example = post.requestBody.content['application/json'].example;
  assert.deepEqual(Object.keys(example).sort(), ['messages', 'model']);
  const common = spec.components.schemas.chatCompletionsRequestCommon.properties;
  assert.match(common.store.description, /not been verified/i);
  assert.match(common.safety_identifier.description, /hashed identifiers as potentially personal data/i);
  const fields = spec.components.schemas.createChatCompletionRequest.allOf[1].properties;
  assert.match(fields.response_format.description, /does not guarantee/i);
});

test('unsupported workflow families stay out of API navigation and schema', () => {
  const nav = read('docs.json');
  for (const path of Object.keys(spec.paths)) assert.doesNotMatch(path, /^\/(assistants|threads|vector_stores)(\/|$)/);
  assert.doesNotMatch(nav, /api-reference\/endpoints\/openAI\/(assistants|vector-stores)/);
});

test('quickstart endpoint link resolves to the overview heading', () => {
  assert.match(read('quickstart.mdx'), /\/api-reference\/introduction#endpoints/);
  assert.match(read('api-reference/introduction.mdx'), /^## Endpoints\s*$/m);
});

test('FAQ retains the gated opaque identity exception', () => {
  const faq = read('faq.mdx');
  assert.match(faq, /opaque organization or user references require an approved identity policy and verified destination handling/i);
  assert.match(faq, /\/onboarding-prompts\/identity/);
});
