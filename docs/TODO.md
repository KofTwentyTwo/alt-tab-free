# TODO — CommandTabFree

_Updated 2026-06-16. Push CI is fully green. Everything below is **OWNER-GATED** — no agent can do these (they need Apple credentials, DNS/hosting, or tokens). Full detail: `docs/CICD-STATUS.md` bucket C, `docs/EXECUTION-STATUS.md` §3._

## Blocking the full publishing pipeline (signed/notarized releases + auto-update)
- [ ] **Apple Developer ID** — obtain a "Developer ID Application" cert for the fork; base64 it into secret `APPLE_P12_CERTIFICATE`; re-sign vendored `vendor/Sparkle/Helpers/*` under the same ID (PLAN §3.3).
- [ ] **Set `CODE_SIGN_IDENTITY`** in `config/local.xcconfig` (lines 45-50, currently commented) to the fork's Developer ID. CI then builds **signed** instead of ad-hoc (the `build app (signed …)` step activates).
- [ ] **Notarization creds** — `APPLE_ID`, `APPLE_PASSWORD` (app-specific password), `APPLE_TEAM_ID` in the `production` Environment.
- [ ] **Real `DOMAIN`/appcast host** — replace `fork.invalid` in `config/local.xcconfig`; serve `https://<DOMAIN>/appcast.xml` (gh-pages); `git rm appcast.xml` + gitignore it; flip `SUEnableAutomaticChecks` back on (PLAN §3.2).

> When all four land, the release tail (`release-gate` → notarize → appcast → semantic-release → gh-release) flips on automatically — no further code change.

## Upstream-sync automation (independent of publishing)
- [ ] **`SYNC_BOT_TOKEN`** — GitHub App installation token (preferred) or fork PAT with contents + pull-requests write. Default `GITHUB_TOKEN` does NOT re-trigger PR checks, so guards never run on the sync PR (`upstream_sync.yml` fails closed without it).
- [ ] **External cron** — hit `repository_dispatch` (type `upstream-sync`) from an external scheduler (immune to GitHub's 60-day in-repo `schedule:` auto-disable) (PLAN §4.2).
- [x] Sync PR labels `sync` / `conflict` / `chokepoint-refresh` created (2026-06-16).

## Bootstrap acceptance tests (after the above)
- [ ] Sync PR through the bot shows guard checks running.
- [ ] A deliberately-relocked branch goes RED on `guard.yml`.
- [ ] Fork build N→N+1 auto-updates via Sparkle.

## Done this session (2026-06-16)
- [x] genstrings consistency gate fixed — regenerated base `Localizable.strings` from source (`d1e1b296`).
- [x] `build_app.sh` builds ad-hoc until cert provisioned; was failing on upstream's Developer ID (`6070f0cb`). Push CI fully green (run `27634828800`).
