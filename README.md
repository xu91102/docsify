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

## Manual reproduction with default Docsify routing

1. Start the same static server with `npm start`.
2. Open `/fixtures/before.html#/first/` in the server preview. Check that the
   code block says `const example = "first";`.
3. Click **Second**, then **First** without refreshing. On **Second** the code
   block still shows the first route's snippet.
4. Repeat on `/fixtures/after.html#/first/`. On **Second** the code block now
   shows `const example = "second";`.

These two pages use default Docsify settings and ordinary hash links. They
do not load the comparison runner.

## Import into CodeSandbox

Import the `repro-2820` branch of `xu91102/docsify` as a GitHub repository.
Open the port 8000 preview and follow the manual reproduction steps above.
If the preview server is stopped, run the **Docsify reproduction** task
or run `PORT=8000 npm start` in the terminal. No dependencies are required.
