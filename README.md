# DevLog Hugo Template

Developer-focused Hugo blog template with:

- clean home page + post cards
- post list and single-post layouts
- tags taxonomy pages
- code-friendly styles
- starter posts and archetype

## Run locally

```bash
hugo server -D
```

Then open <http://localhost:1313>.

## Build static site

```bash
hugo
```

Output is generated in `public/`.

## Deploy to GitHub Pages

This template includes GitHub Actions workflow:

- `.github/workflows/hugo-gh-pages.yml`

How it works:

1. Push to `main`
2. GitHub Action builds Hugo site
3. Action deploys `public/` to GitHub Pages

Repository settings:

1. Go to `Settings > Pages`
2. Set source to `GitHub Actions`

Notes:

- Workflow sets `--baseURL` automatically from the Pages URL.
- Local `hugo.toml` keeps a default `baseURL` for local/preview builds.

## Create a new post

```bash
hugo new posts/my-new-post.md
```

Edit front matter and set `draft = false` when ready to publish.

## Main files

- `hugo.toml`
- `layouts/_default/baseof.html`
- `layouts/index.html`
- `layouts/_default/list.html`
- `layouts/_default/single.html`
- `assets/css/main.css`
