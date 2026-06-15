# SESSION-STATE — CommandTabFree (de-paywalled AltTab fork)

_Updated 2026-06-15. `master` now carries the fork (merged + pushed). Public pre-release **v100.0.3** live; Homebrew tap live._

## ⚠️ NEXT SESSION — START HERE

**Immediate blocker:** `ci_cd.yml` (push→master) is RED at `scripts/ensure_generated_files_are_up_to_date.sh`. Guards + commitlint now pass; this is the first step that fails (it runs before build/tests). Cause: this session rebranded the l10n `.strings` (AltTab→CommandTabFree) with a `perl` find/replace, but that script regenerates l10n via **`genstrings`** and hard-fails because the committed `.strings` keys no longer match the code-derived keys `genstrings` produces (PLAN §4.5). The correct §3.1 task is a genstrings regeneration, not a hand-replace.

**Fix it first (steps):**
1. Read `scripts/ensure_generated_files_are_up_to_date.sh` and `scripts/l10n/` to get the exact regeneration command(s) and what it diffs (it may regenerate more than `.strings`).
2. Run that regeneration locally so the base `.strings` keys are rebuilt from current code; then re-apply the CommandTabFree brand to the regenerated VALUES, **preserving upstream attribution** (skip any line containing `Pontoise` / `fork of AltTab` / `Attribution to the upstream`). Verify `bash scripts/ensure_generated_files_are_up_to_date.sh` exits 0 locally.
3. Commit (header **≤72 chars** — repo commitlint enforces it) and push (workflow files push via the **SSH** remote; gh token lacks `workflow` scope).
4. Re-run/watch CI: `gh run watch $(gh run list --repo KofTwentyTwo/CommandTabFree --branch master --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status`. Next-untested steps after that gate are `run_tests.sh` + `build_app.sh` (Xcode build on `macos-15`, Xcode 26.0.1) — confirm they go green too. The release tail will stay SKIPPED (expected) until owner secrets land.

**Then owner-gated (NOT automatable; details in EXECUTION-STATUS §3.3–3.5 + CICD-STATUS.md bucket C):** Apple Developer ID → `APPLE_P12_CERTIFICATE`/`APPLE_ID`/`APPLE_PASSWORD`/`APPLE_TEAM_ID` in the `production` env (unblocks signed+notarized releases); `SYNC_BOT_TOKEN` (auto upstream-sync PRs); real `DOMAIN`/appcast host to replace `fork.invalid`. Already set: `SPARKLE_ED_PRIVATE_KEY` + `production` env + Sparkle public key in Info.plist.

**Repo facts:** GitHub = `KofTwentyTwo/CommandTabFree` (renamed from alt-tab-free; local dir is still `~/Git.Local/kof22/alt-tab-free`, SSH remote points at CommandTabFree). Latest release v100.0.3 (zip + dmg). ⌘⇥ app/menu-bar icon is FINAL (owner-approved). master HEAD `6313c295`, working tree clean.


## What this is
`KofTwentyTwo/CommandTabFree` is a fork of **AltTab** (`lwouis/alt-tab-macos`, GPL-3.0) that neutralizes the v11 Pro paywall so all features are free, rebranded **CommandTabFree**. Strategy: thin, merge-stable patch tracking upstream forever (`docs/PLAN-maintained-fork.md`).

## ✅ DONE
- De-paywall + anti-relock tests + frozen identity (`com.koftwentytwo.commandtabfree`) + brand sweep + ⌘⇥ icon (final) — all on **`master`** (was `depaywall-free`, fast-forward merged, HEAD `c7d2d968`, pushed to origin; source is public for GPL §6).
- **Sparkle EdDSA keypair generated.** Public key in `Info.plist` (`SUPublicEDKey`); private key in 1Password item **"CommandTabFree-Sparkle-EdDSA"** + GitHub Actions secret `SPARKLE_ED_PRIVATE_KEY` (env `production`); keychain account `commandtabfree`. `SUEnableAutomaticChecks=false` until a real appcast host exists. This fixed the launch-time "updater failed to start" alert.
- **Public release v100.0.3** (pre-release, **unsigned / not notarized**, universal x86_64+arm64) — ⌘⇥ menu-bar icon, redesigned About (KofTwentyTwo identity + AltTab attribution links), and a **full l10n rebrand** (product name → CommandTabFree across base/en + all ~20 translated languages; upstream attribution kept). Earlier v100.0.0/v100.0.1/v100.0.2 superseded.
- **Homebrew tap live:** `brew install --cask koftwentytwo/tap/commandtabfree` (`KofTwentyTwo/homebrew-tap` → `Casks/commandtabfree.rb`). Cask strips the quarantine (postflight `xattr`) for the unsigned app.
- **CI/CD wired** (GitHub Actions), PARTIALLY green — see "NEXT SESSION" above. Passing now: Guard B/C (anti-relock + conflict-marker), commitlint. The sign/notarize/appcast/semantic-release/gh-release tail is gated on a `release-gate` step that **auto-activates** when `APPLE_*` secrets are added (so missing secrets SKIP, not fail). **CI is currently RED** at `scripts/ensure_generated_files_are_up_to_date.sh` (genstrings consistency gate, runs before build/tests). Fixed this session: Guard B grep now matches the shipped `guard false else { return .pro }` patch (was checking the PLAN's never-shipped `if false`/`alt-tab-free [depaywall]` form); `update_appcast.sh` → `--ed-key-file`; commitlint sync-merge `ignores`; dropped upstream-only scripts (AppCenter/website); commit headers must be ≤72 chars. Full status: `docs/CICD-STATUS.md`.
- **Local daily driver installed:** `/Applications/CommandTabFree.app` = **Release** build (no QA menu) signed with the `Local Self-Signed` cert (stable signature → no TCC re-grant loop). Remaining: user grants Accessibility + Screen Recording on first launch.

### Build recipes (verified this session)
- **Local (stable, no QA menu):** `xcodebuild -project alt-tab-macos.xcodeproj -scheme Release -derivedDataPath DerivedData CURRENT_PROJECT_VERSION=<v> CODE_SIGN_IDENTITY="Local Self-Signed" CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM="" OTHER_CODE_SIGN_FLAGS="--timestamp=none" CODE_SIGNING_ALLOWED=YES` (needs `scripts/codesign/setup_local.sh` cert first; user runs it — keychain/admin prompt).
- **Public artifact (ad-hoc):** same recipe but `CODE_SIGN_IDENTITY="-" CODE_SIGNING_REQUIRED=NO`. Zip with `ditto -c -k --sequesterRsrc --keepParent`.
- **GOTCHA — do NOT pass `-configuration Release`.** With `-scheme Release` it splits SPM package outputs and breaks clean-build module-map generation (`build/GeneratedModuleMaps/*.modulemap not found`, then "unable to resolve module Cocoa/Sparkle/..."). Use the scheme only (matches `scripts/build_app.sh`). A failed build can corrupt `build/`; recover with `rm -rf build DerivedData` then rebuild.

## ⏳ NEXT (owner-gated — `docs/EXECUTION-STATUS.md` §3)
- **Apple Developer ID** (long pole): set `CODE_SIGN_IDENTITY` in `config/local.xcconfig`, re-sign Sparkle helpers, notarize → re-release signed/notarized, then drop the cask's quarantine postflight.
- **Real DOMAIN/appcast** (kof22.com ready): replace `fork.invalid` in `local.xcconfig`, serve `/appcast.xml`, flip `SUEnableAutomaticChecks` back on.
- **Wire CI:** `update_appcast.sh` uses the deprecated `sign_update -s` — switch to `--ed-key-file` (or `--account commandtabfree`) for the new key; create `sync`/`conflict`/`chokepoint-refresh` labels; external cron for `upstream_sync.yml`.
## Gotchas
- Bundle id FROZEN (`com.koftwentytwo.commandtabfree`); keychain/UserDefaults suites derive from it.
- Don't `git revert 9147a4a8` (mixes paywall with a 1869-file reorg).
- Fork version line starts at **v100.0.0** (avoids collision with upstream tags merged into `master`).
- `aws`: use `AWS_PROFILE=kingsrook_root_admin aws …` (the `--profile` flag fails on the local wrapper).
