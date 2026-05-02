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
