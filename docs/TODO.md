# TODO — CommandTabFree

_Updated 2026-06-16. The **signed + notarized publishing pipeline is LIVE** — **v100.1.0** is released (Gatekeeper-accepted). Remaining items are auto-update, the Homebrew cask, and upstream-sync. Full detail: `docs/CICD-STATUS.md`, `docs/EXECUTION-STATUS.md` §3._

## ✅ Signed + notarized releases — DONE (2026-06-16)
- [x] Apple Developer ID `Developer ID Application: James Maes (2X834TJ5MA)` provisioned; cert + app-specific password in `production` secrets (`APPLE_P12_CERTIFICATE`/`APPLE_P12_PASSWORD`/`APPLE_ID`/`APPLE_PASSWORD`/`APPLE_TEAM_ID`).
- [x] `CODE_SIGN_IDENTITY` + Manual style + `TEAM_ID` set in `config/local.xcconfig`.
- [x] Vendored `vendor/Sparkle/Helpers/*` committed re-signed under the fork Developer ID.
- [x] Full release tail proven on CI (run `27643432063`): signed → notarized → stapled → released. **v100.1.0** published.

## Auto-update (deferred by choice — appcast already publishes to gh-pages)
- [ ] **Real `DOMAIN`** — replace `fork.invalid` in `config/local.xcconfig` with the fork host (kof22.com).
- [ ] Serve the gh-pages `appcast.xml` at `https://<DOMAIN>/appcast.xml` (CNAME the gh-pages site).
- [ ] `git rm` the in-tree `appcast.xml` skeleton + gitignore it (feed is published out-of-tree to gh-pages); flip `SUEnableAutomaticChecks` back on (PLAN §3.2).

## Homebrew cask (now that builds are notarized)
- [ ] Drop the quarantine-strip postflight (`xattr`) from `KofTwentyTwo/homebrew-tap` `Casks/commandtabfree.rb` — no longer needed for a notarized app.
- [ ] Bump the cask to v100.1.0.

## Upstream-sync automation
- [x] `.fork-sync-state` reset to `v11.3.0`; release tail no longer clobbers the cursor with the fork tag (`ci_cd.yml`).
- [ ] **Re-wire the cursor advance** into the upstream-sync merge flow so it records the synced **UPSTREAM** tag (not the fork release tag) — `upstream_sync.yml` (PLAN §4.2).
- [ ] **`SYNC_BOT_TOKEN`** — GitHub App installation token (or fork PAT with contents + pull-requests write). Default `GITHUB_TOKEN` does NOT re-trigger PR checks, so guards never run on the sync PR.
- [ ] **External cron** — hit `repository_dispatch` (type `upstream-sync`) from an external scheduler (immune to GitHub's 60-day in-repo `schedule:` auto-disable).
- [x] Sync PR labels `sync` / `conflict` / `chokepoint-refresh` created.

## Bootstrap acceptance tests (after the above)
- [ ] Sync PR through the bot shows guard checks running.
- [ ] A deliberately-relocked branch goes RED on `guard.yml`.
- [ ] Fork build N→N+1 auto-updates via Sparkle (needs DOMAIN/appcast live).

## Done earlier this session (2026-06-16)
- [x] genstrings consistency gate fixed — regenerated base `Localizable.strings` from source (`d1e1b296`).
- [x] `build_app.sh` builds ad-hoc until cert provisioned; was failing on upstream's Developer ID (`6070f0cb`). Push CI green (run `27634828800`).
