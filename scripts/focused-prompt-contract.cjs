const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const route = 'onboarding-prompts/focused-attribution-contract-v1';
const url = `https://docs.hicap.ai/${route}`;
const focused = new Set(['tagging-helper', 'base-dimensions', 'per-call-features']);

// Resolve the documented prerequisite locally; never fetch a live page in CI.
function resolvePrompt(name, read, navigation) {
  const prompt = read(`onboarding-prompts/${name}.mdx`);
  if (!focused.has(name)) return prompt;
  const block = prompt.match(/````text wrap title="Implementation prompt"\s*([\s\S]*?)````/);
  if (!block || !block[1].includes(url) ||
      !/If it is unavailable, stop and report the missing prerequisite/.test(block[1])) {
    throw new Error(`${name}: missing required shared contract or fail-closed instruction`);
  }
  const pages = navigation.navigation.tabs.flatMap(tab => tab.groups.flatMap(group => group.pages));
  if (!pages.includes(route)) throw new Error(`${name}: shared contract is not registered`);
  const contract = read(`${route}.mdx`);
  const shared = contract.match(/````text wrap title="Focused attribution contract v1"\s*([\s\S]*?)````/);
  if (!shared) throw new Error(`${name}: shared contract instruction block is missing`);
  return `${prompt}\n${shared[1]}`;
}

function loadPrompt(root, name) {
  const read = path => readFileSync(join(root, path), 'utf8');
  return resolvePrompt(name, read, JSON.parse(read('docs.json')));
}

module.exports = { loadPrompt, resolvePrompt, route, url };
