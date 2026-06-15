// alt-tab-free [depaywall]: commitlint config with an `ignores` predicate so a `chore(sync): merge
// upstream` PR (and the upstream commits it drags in through the merge's second parent) does NOT fail
// commitlint and block the release job (PLAN §4.3). ci_cd.yml lints the WHOLE pushed range on push and
// base..head on a PR, both of which include upstream's own (non-conventional) messages on a sync merge.
// `defaultIgnores: true` keeps config-conventional's built-in "Merge …" ignore; the predicates below
// drop the synthetic merge subject and any "Merge …" / "Revert …" line we don't author.
module.exports = {
    extends: ['@commitlint/config-conventional'],
    defaultIgnores: true,
    ignores: [
        (msg) => /^chore\(sync\): merge upstream /.test(msg), // our synthetic merge commit (§4.2)
        (msg) => /^Merge /.test(msg),                          // belt-and-suspenders (merge commits)
        (msg) => /^Revert /.test(msg),                         // upstream revert subjects
    ],
}
