# Reproduction for docsifyjs/docsify#2820

Both directories have byte-identical Markdown and a different sibling `snippet.js`.
The comparison runs real Docsify browser bundles on the same fixture.

| Visit | Develop `91c923a` | PR `4ecc34e` |
| --- | --- | --- |
| `/first/` | `first` | `first` |
| `/second/` | `first` (stale) | `second` |
| `/first/` | `first` | `first` |

1. Run `npm start` (Node.js, no package install), or `python3 -m http.server 8000`.
2. Open http://localhost:8000 and click **Run first → second → first**.
3. Compare the **/second/** row. The button changes the hash route in the same page; a hard reload clears the cache and can hide the bug.

`vendor/before.js` and `vendor/after.js` were built with the repository's Rollup configuration at
[develop `91c923a`](https://github.com/docsifyjs/docsify/commit/91c923accf6e215fb3083c490a4ba64aec63a674)
and [PR head `4ecc34e`](https://github.com/docsifyjs/docsify/commit/4ecc34ed2c240648d55f95f044cf22e1e66e539f).
The fixture only observes the rendered code after Docsify's `doneEach` hook.
