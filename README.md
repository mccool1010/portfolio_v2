# Hari Krishna · Portfolio v3

A static site with no framework and no build step. It has an interactive 3D hero and an animated 3D scene for each project, all drawn on canvas without any libraries. Project data syncs itself from GitHub.

## Files

| File | What it is |
|---|---|
| `index.html`, `styles.css` | Page structure and design |
| `scene.js` | 3D engine: hero terrain and the six project scenes |
| `app.js` | Renders everything from the two data files |
| `data/profile.json` | **Your content.** Edit this to change text, projects, stats and experience |
| `data/github.json` | **Auto-generated.** Don't edit by hand |
| `scripts/update-github.mjs` | Pulls your repos, PRs, events and languages from GitHub |
| `.github/workflows/update-github.yml` | Runs that script every 6 hours and commits changes |

## Deploy (once), without touching the live site

`vercel.json` tells Vercel this is a plain static site, so no dashboard settings need changing.

1. In your existing repo, create a branch `v3`, copy these files in (replacing the old site), add `resume.pdf`, and push the branch.
2. Vercel builds the branch at a separate **preview link**. Your live link keeps serving the old site.
3. Check the preview on phone and desktop. When you're happy, merge `v3` into `main`. The live link now shows the new site.
4. If anything goes wrong after merging: Vercel dashboard → Deployments → the previous production deployment → **Instant Rollback**.
5. After merging, go to GitHub → Settings → Actions → General → Workflow permissions and choose **Read and write**. Then open Actions and run "Sync GitHub activity" once. (Scheduled runs only happen on `main`.)

## Auto-update: what happens on its own

Every 6 hours the Action fetches:
- **New repos**, which appear under "Also on GitHub". The summary comes from the repo description, or from the first paragraph of the README if there's no description.
- **Last-updated times** on each featured project
- **PRs you open in other projects**: merged, open or closed, with the badge set automatically
- **Recent events** (pushes, PRs, comments), language mix and the activity chart

If anything changed, it commits `data/github.json` and Vercel redeploys.

**For the full contribution heatmap** (optional): create a fine-grained token at GitHub → Settings → Developer settings with read-only access to public repos. Save it as a repo secret named `GH_PAT`.

## Pages

The site has three tabs that slide sideways: **Work** (`/`), **Open source** (`/#open-source`) and **Contact** (`/#contact`). The tabs sit in the nav next to the theme and Resume buttons. Quick-access buttons in the hero and cards at the bottom of Work link to the other two. Links to `/#open-source` or `/#contact` open straight on that tab, and the browser back button works.

## Everyday edits

- **Feature a new project:** add an entry to `featured` in `profile.json` with `"repo"` set to the repo name. Pick a `scene` from `terrain`, `pose`, `orb`, `pipeline`, `embeddings` or `wave`.
- **Hide a repo from the grid:** add its name to `hideRepos`.
- **Nicer title or summary for a repo:** add it to `repoOverrides`, or just give the repo a description on GitHub.
- **Explain a new open-source PR:** new PRs appear automatically with a generic animation. To add the problem, the fix and a custom animation, add an entry under `prStories` keyed by the PR URL: `headline`, `problem`, `approach`, `tags`, `scene`. Scenes for PRs are `forecast`, `wheels` or `diff`; any project scene works too.
- **Contact cards:** edit `contactLinks`. The URLs come from `links`.
- **Live demo links** are taken from the repo's "Website" field on GitHub automatically.

## Light and dark mode

The site follows the visitor's local clock: light from 6:00 to 18:00, dark otherwise. It flips live at those times. The sun/moon button in the nav switches it manually and remembers the choice. The green dot on the button means it's on auto. Picking the mode the clock would choose anyway puts it back on auto. To change the hours, edit `byClock()` in the script at the top of `index.html`.

## Run locally

```
python -m http.server 8000   # then open http://localhost:8000
```
