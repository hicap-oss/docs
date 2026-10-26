# Hicap Docs

This repository contains the Mintlify documentation site for Hicap.

The docs explain how developers can use the Hicap API to access OpenAI, Anthropic, Google Gemini, Moonshot, Zhipu, MiniMax, ElevenLabs, and other model providers through a single OpenAI-compatible API.

## What is included

- Developer quickstart for making the first Hicap API request
- Provider guides for supported model families
- FAQ covering pricing, security, architecture, and data handling
- OpenAI-compatible API reference generated from `openapi.json`
- Mintlify site configuration in `docs.json`

## Key URLs

- Docs site: configured as the Hicap Mintlify docs site
- API base URL: `https://api.hicap.ai/v1`
- Platform dashboard: `https://platform.hicap.ai/`
- Model list: `https://hicap.ai/models`
- Support: `support@hicap.ai`

## Local development

Install dependencies:

```bash
pnpm install
```

Run the docs locally:

```bash
pnpm dev
```

This starts `mintlify dev` from the project root, where `docs.json` lives.

## Maintenance checks

Use these commands before publishing changes:

```bash
pnpm install --frozen-lockfile
pnpm audit
pnpm outdated
pnpm exec mintlify --version
```

The repo uses pnpm overrides and a small pnpm patch for Mintlify's preview package so current transitive dependency audit requirements can pass while the Mintlify CLI remains usable.

## Publishing

Changes are deployed through the Hicap Mintlify/GitHub integration after updates are pushed to the configured production branch.

If local preview fails, first reinstall dependencies with `pnpm install`. If a page 404s locally, confirm the route is listed in `docs.json` and that you are running commands from this repository root.

## Agent onboarding prompts

The guide at `/concepts/implement-attribution-with-an-agent` copies short instructions such as:

```text
Read https://docs.hicap.ai/onboarding-prompts/attribution and help me set this up.
```

Maintain the full prompts in `onboarding-prompts/*.mdx`. Mintlify serves these as dedicated HTML pages with the full prompt in the initial HTML response, so agents can read them without running JavaScript. They are registered in `docs.json` with `hidden: true` so they remain directly accessible without adding sidebar entries. Each focused step has its own route. Keep route names stable because users may save the copied instructions.

To verify, run the local preview, open the guide, and copy the master and focused instructions. Each clipboard value should contain only one `Read https://docs.hicap.ai/onboarding-prompts/... and help me set this up.` instruction. Follow each review link and confirm the full prompt renders without needing to expand an accordion.

The managed prompts require coverage of named AI pipeline roles in ordinary workflows as well as explicit multi-agent modes. Verification captures final outbound headers from actual application functions, with mocked provider responses, and separates mock-tested changes from deployed and runtime-verified traffic. Missing dimensions must be classified; do not create fake agent values just to clear an Unattributed dashboard group.
