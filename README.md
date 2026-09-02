# apps.humation.app

The showcase of apps and web services built with [Humation](https://humation.app), the
hand-drawn deterministic avatar engine.

Live site: https://apps.humation.app

## Add your app

Paste this into the coding agent you use in your project:

```
Fetch https://apps.humation.app/llms.txt and follow the instructions to submit this app to apps.humation.app.
```

Or follow [CONTRIBUTING.md](CONTRIBUTING.md) to open the pull request by hand.

## Layout

| Path | What it is |
| --- | --- |
| `apps/<slug>/` | One listing: `app.json`, `icon.png`, `screenshots/` |
| `schema/app.schema.json` | Source of truth for listing fields, served at `/schema/app.schema.json` |
| `llms.txt` | Agent instructions, served at `/llms.txt` |
| `scripts/validate.mjs` | Listing validator, run by contributors and CI |
| `site/` | The TanStack Start site deployed to Cloudflare Workers |

## Development

```bash
bun install
bun run validate          # all listings
bun run dev               # site at http://localhost:4321
bun run build             # static output in site/dist/client
```

## License

Code in this repository is MIT licensed. Listing content (names, icons, screenshots)
belongs to the respective developers and is displayed with their permission.
