# Contributing a listing

apps.humation.app lists apps and web services built with [Humation](https://humation.app).
A listing is one directory, `apps/<slug>/`, containing `app.json`, `icon.png` and a
`screenshots/` folder. Add yours with a pull request.

## Fastest way: let your coding agent do it

Paste this into the agent you use in your project (Claude Code, Codex, Cursor, Zo, ...):

```
Fetch https://apps.humation.app/llms.txt and follow the instructions to submit this app to apps.humation.app.
```

The agent verifies the Humation dependency, collects the listing data, captures screenshots,
forks this repository, runs the validator and opens the pull request.

## Manual way

1. Fork this repository and clone your fork.
2. Create `apps/<slug>/` where `<slug>` is lowercase letters, digits and single hyphens.
3. Write `apps/<slug>/app.json` following [`schema/app.schema.json`](schema/app.schema.json).
   The example in [`llms.txt`](llms.txt) is a good starting point.
4. Add `icon.png` (PNG, 512x512, at most 512 KB) and one to five screenshots under
   `screenshots/` (PNG, JPEG or WebP; shorter side at least 640 px, longer side at most
   3000 px, at most 2 MB each).
5. Run `bun install` then `bun run validate apps/<slug>` until it passes.
6. Open a pull request that changes only `apps/<slug>/`.

## Requirements

- The app must depend on a Humation package (`@humation/react`, `@humation/core`,
  `@humation/web-component`, `@humation/assets-humation-1` or `humation-swift`) and be
  publicly reachable at the `url` you list.
- Images must be real screens of your app. No placeholders, stock or generated images.
- By submitting you confirm that you have the rights to the name, icon and screenshots,
  and you grant Humation Labs permission to display them on apps.humation.app and in
  Humation promotional material that points back to your listing.
- Maintainers may ask for changes, decline listings that do not fit, or remove listings
  whose app is no longer reachable.

## Updating or removing a listing

Open a pull request that edits or deletes your `apps/<slug>/` directory. Keep `addedAt`
unchanged when editing.
