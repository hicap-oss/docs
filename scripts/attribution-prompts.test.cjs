// Documentation checks only; no agent evaluation or gateway requests.
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const root = join(__dirname, '..');
const guide = readFileSync(join(root, 'concepts/implement-attribution-with-an-agent.mdx'), 'utf8');
const config = JSON.parse(readFileSync(join(root, 'docs.json'), 'utf8'));
const instructions = [...guide.matchAll(/Read https:\/\/docs\.hicap\.ai(\/onboarding-prompts\/[a-z-]+) and help me set this up\./g)];

test('guide copies five unique short instructions pointing to maintained routes', () => {
  assert.equal(instructions.length, 5);
  assert.equal(new Set(instructions.map(match => match[1])).size, 5);
  const blocks = [...guide.matchAll(/```text[^\n]*\n([\s\S]*?)```/g)];
  assert.equal(blocks.length, 5);
  for (let i = 0; i < blocks.length; i++) assert.equal(blocks[i][1].trim(), instructions[i][0]);
});

test('each instruction resolves to a registered standalone prompt', () => {
  for (const [, route] of instructions) {
    const path = route.slice(1);
    assert.ok(JSON.stringify(config.navigation).includes(path), path);
    assert.ok(existsSync(join(root, path + '.mdx')), path);
    const content = readFileSync(join(root, path + '.mdx'), 'utf8');
    assert.match(content, /hidden: true/);
    assert.match(content, /````text[\s\S]+````/);
    assert.ok(content.length > 1500, 'A linked page must contain the full prompt');
  }
});

test('standalone prompts retain authentication and meaningful request verification', () => {
  for (const [, route] of instructions) {
    const content = readFileSync(join(root, route.slice(1) + '.mdx'), 'utf8');
    for (const term of ['https://api.hicap.ai/v1', 'api-key', 'HICAP_API_KEY', 'x-hicap-tags', 'FINAL outgoing HTTP headers', 'mocked', '.hicap']) assert.ok(content.includes(term), route + ': ' + term);
  }
});

test('guide keeps balanced components and valid review links', () => {
  for (const tag of ['Note', 'AccordionGroup', 'Accordion', 'CardGroup', 'Card']) {
    assert.equal([...guide.matchAll(new RegExp('<' + tag + '(?:\\s|>)', 'g'))].length, [...guide.matchAll(new RegExp('</' + tag + '>', 'g'))].length, tag);
  }
  for (const [, target] of guide.matchAll(/(?:\]\(|href=")(\/[^\s)"#]+)/g)) assert.ok(existsSync(join(root, target.slice(1) + '.mdx')), target);
});
