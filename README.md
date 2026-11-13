# hieesu19 — Astro Markdown blog (V11)

This version supports **automatically generated folders and unlimited nesting**.
The website remains a static Astro site deployable to GitHub Pages.

## Quick start

Install Node.js 24 or later, then open the project folder (the one containing `package.json`) in PowerShell:

```powershell
npm install
npm run dev
```

Open the local address displayed by Astro (normally `http://localhost:4321`).

## Publish a new Markdown post

Create a `.md` file anywhere under `src/content/posts/`, with at least one folder in the path:

```text
src/content/posts/
├── cybersec/
│   ├── ctf/
│   │   ├── htb/
│   │   │   └── first-machine.md
│   │   └── thm/
│   ├── re/
│   └── malware/
├── projects/
│   └── tools/
│       └── ida/
│           └── plugins/
│               └── first-plugin.md
├── daily/
├── book/
└── temp/
    └── first-note.md
```

No manual navigation, route or category changes are needed. Every published post contributes all of its parent folders to the navigation. For example:

- `src/content/posts/temp/first-note.md` → sidebar **TEMP**, category `/temp/`, article `/posts/temp/first-note/`.
- `src/content/posts/projects/tools/ida/plugins/first-plugin.md` → sidebar **Projects → Tools → IDA → Plugins**, category `/projects/tools/ida/plugins/`.
- Click a parent folder to see posts in **that folder and all its descendants**. Click a child to see only its own subtree.
- Add or remove Markdown files, then Astro rebuilds the navigation and relevant category pages.
- Set `draft: true` in a post to keep it out of the published site (and prevent a draft-only folder from appearing).
- **Empty folders** without published Markdown posts are intentionally hidden.

**Example posts to copy** are in `examples/TEMP-example.md` and `examples/IDA-plugins-example.md` (outside `src/content/posts/`, so they don't appear on the site until you copy them).

## Markdown format

```md
---
title: "My first writeup"
description: "A short summary."
date: 2026-11-13
tags: [CTF, Linux]
read: 7
---

## Enumeration

My notes here.

```bash
nmap -sC -sV 10.10.10.10
```
```

To include images, put them in `public/images/` and reference them as `![Alt](/images/example.png)`.
The existing image assets under `public/assets/photos/` are sample images.

## Folder names

Unrecognized folder names are formatted automatically, e.g. `machine-notes` → **Machine Notes**. The optional cosmetic overrides for familiar folder labels such as **HTB → Hack The Box**, **THM → TryHackMe**, and **TEMP** live in `src/lib/posts.ts` (`customLabels`). You do not need to edit this map to create folders.

Do not set a custom `slug:` in Markdown frontmatter: category discovery relies on Astro's automatically generated path-based entry ID.

The site's own system URLs `/about/` and `/posts/` are reserved; don't create top-level categories with either name. Use short, URL-friendly folder names (lowercase letters, digits and hyphens) for consistent paths.

## What changed in V11

- `src/lib/posts.ts`: automatic category tree, arbitrary depth, category naming, tree filtering.
- `src/lib/navigation.ts`: obtains the tree dynamically instead of defining folders manually.
- `src/pages/[...category].astro`: static pages for every category and ancestor, including new top-level categories.
- `src/components/TreeNode.astro`: recursive nested navigation with expanded current ancestors.
- `src/components/SectionPage.astro`: displays posts from the selected folder subtree.
- `src/pages/posts/[...slug].astro`: full breadcrumb trail for any nesting depth.
- `src/pages/index.astro`: top-level category cards are generated from the same tree.
- `public/assets/site.js`: client-side query-string filtering removed; selecting a folder navigates to its actual page.

The previous V10 example Markdown posts from `cybersec/htb/` and `cybersec/thm/` were moved to `cybersec/ctf/htb/` and `cybersec/ctf/thm/` to make the **CTF → HTB/THM** tree match the actual filesystem.

## Build and deploy

```powershell
npm run build
npm run preview
```

To use GitHub Pages, create a **public** repository named `YOUR_USERNAME.github.io`, push the entire source project (not just `dist/`), and select **Settings → Pages → Source: GitHub Actions**. The included workflow deploys on pushes to `main`.

The project currently targets a user-site repository, not a regular project repository under `/<repo>/`. For a project repo, configure Astro's `base` and adjust absolute asset paths.

## Notes

All sample posts and photos are illustrative. Replace them before publicly publishing personal experiences.
