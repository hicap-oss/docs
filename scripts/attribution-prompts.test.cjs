// Documentation-contract checks only: these do not evaluate an agent or a gateway.
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const root = join(__dirname, '..');
const page = readFileSync(join(root, 'concepts/implement-attribution-with-an-agent.mdx'), 'utf8');
const prompts = [...page.matchAll(/````text[^\n]*\n([\s\S]*?)````/g)]
  .map((match) => match[1].replace(/\s+/g, ' ').toLowerCase());
const eachPromptIncludes = (terms) => {
  for (const [index, prompt] of prompts.entries()) {
    for (const term of terms) {
      assert.ok(prompt.includes(term.toLowerCase()), `Prompt ${index + 1} must include ${term}`);
    }
  }
};

test('master and four focused prompts have balanced fences/components', () => {
  assert.equal(prompts.length, 5);
  assert.equal([...page.matchAll(/^\s*````(?:text[^\n]*)?$/gm)].length, 10);
  for (const tag of ['Note', 'AccordionGroup', 'Accordion', 'CardGroup', 'Card']) {
    assert.equal([...page.matchAll(new RegExp(`<${tag}(?:\\s|>)`, 'g'))].length,
      [...page.matchAll(new RegExp(`</${tag}>`, 'g'))].length, tag);
  }
});

test('every standalone prompt retains the gateway and five-dimension contract', () => {
  eachPromptIncludes(['https://api.hicap.ai/v1', 'api-key', 'HICAP_API_KEY', 'x-hicap-tags',
    'JSON', 'string', 'agent', 'env', 'system', 'feature', 'domain']);
  assert.ok(!page.includes('business_unit'));
});

test('all prompts separate source observations from actionable configuration', () => {
  eachPromptIncludes(['observed', 'recommended', 'unknown', 'HICAP_ENV=development',
    'staging', 'production', 'preview', 'NODE_ENV', 'config']);
});

test('all prompts require actual update-safe application-root Markdown reports', () => {
  eachPromptIncludes(['.hicap/tagging-report.md', 'preserve', 'timestamp',
    'Scope and evidence', 'Observed attribution', 'Recommended configuration',
    'Request and process mapping', 'Implementation coverage',
    'Validation and open decisions', 'relative path']);
});

test('all prompts retain concrete queue, retry and duplicate-input acceptance', () => {
  eachPromptIncludes(['duplicate', 'JSON', 'retry re-enqueue']);
  for (const [index, prompt] of prompts.entries()) {
    // Permit the master/focused wording to differ, but require the same behavior.
    const requirements = [
      /producer persist(?:ence|ing)/,
      /consumer (?:validation\/)?restoration/,
      /(?:attempt that fails and a subsequent attempt that succeeds|failing attempt then a successful retry)/,
      /(?:independently|separately) captured (?:headers\/context|contexts\/headers)/,
    ];
    for (const requirement of requirements) {
      assert.match(prompt, requirement, `Prompt ${index + 1}: ${requirement}`);
    }
  }
  assert.ok(page.includes('escaped-equivalent'));
  assert.ok(page.includes('independently captured'));
  assert.ok(!page.includes('2–3 highest-traffic'));
});

test('documented site route and local page links resolve', () => {
  const config = readFileSync(join(root, 'docs.json'), 'utf8');
  assert.ok(config.includes('concepts/implement-attribution-with-an-agent'));
  for (const [, target] of page.matchAll(/(?:\]\(|href=")(\/[^\s)"#]+)/g)) {
    assert.ok(existsSync(join(root, `${target.slice(1)}.mdx`)), target);
  }
});


test('all prompt panels wrap and use narrowly scoped scrolling styles', () => {
  assert.equal([...page.matchAll(/````text wrap title="[^"]+"\n/g)].length, 5);
  assert.equal([...page.matchAll(/className="attribution-prompt" role="region" tabIndex=\{0\} aria-label=/g)].length, 5);
  const css = readFileSync(join(root, 'styles/attribution-prompts.css'), 'utf8');
  assert.ok(css.includes('.attribution-prompt'));
  assert.ok(css.includes('max-height: min(65vh, 42rem)'));
  assert.ok(css.includes('overflow-y: auto'));
  assert.ok(css.includes('overflow-wrap: anywhere'));
  assert.ok(!css.includes('display: none'));
});
