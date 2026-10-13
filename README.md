# Ian Gavilan — portfolio

A student portfolio for games, websites, creative experiments, apps and research. The collection combines working browser demos with clearly labeled native prototypes, local tools and work still in development. A project being listed does not mean every feature is finished or publicly hosted.

## Run and build

```powershell
npm install
npm run dev
```

The permanent development and preview port is **5140**, with `--strictPort`. If that port already has a running portfolio server, reuse it. Do not move the port or stop an unrelated process.

```powershell
npm run build
npm run preview
```

Vite builds to `dist/`. The production preview also uses port 5140, so stop a development server that you started before starting preview. `dist/` and `node_modules/` are ignored by Git.

## Edit the site

- `index.html`: page structure, metadata, welcome animation and contact links.
- `src/main.js`: project rendering, search, category filters, project dialogs, preview media, keyboard interaction and motion behavior.
- `src/styles.css`: the blue-and-white design, local fonts, responsive layout and animations.
- `public/data/projects.json`: the complete project catalog. Keep each `id` unique and preserve honest status and capability descriptions.
- `public/assets/`: project screenshots, local fonts, preview videos and character artwork. Images and videos should show the project they represent.
- `public/projects/<id>/`: self-contained production browser demos. Copy only a project's verified public build here, including its required assets.
- `public/downloads/`: explicitly packaged native downloads, currently the Windows Pocket Gods prototype.

Each catalog entry supplies a title, category, summary, detail, status, tags and optional links/media. `url` opens the actual demo or download; `sourceUrl` links to a verified public source repository. Leave unavailable links blank. `image` is the preview still; `video` supplies an optional motion preview. `mascot` and `mascotSheet` supply optional character art. `featured` selects prominent work.

Catalog media and demo URLs use page-relative paths such as `./assets/project-name.jpg` and `./projects/project-id/`. Source HTML and CSS use `/assets/` references for fonts and the favicon so Vite can correctly rewrite them into the build. Do not point CSS at `src/assets/` unless the file actually lives there.

## What the statuses mean

- **Live demo**: a browser demo has an actual URL. A design concept may still use sample content; its detail text describes those boundaries.
- **Archived demo**: a preserved browser edition rather than an actively maintained product.
- **Native prototype**: a game or application that needs its native runtime. Only entries with an explicit download link have a packaged download here.
- **Local project**: a tool that depends on a local service, desktop runtime, hardware or other setup. Listing it does not expose that service publicly.
- **In development**: unfinished work without a ready public demo.
- **Research**: a study or experiment, not a deployed application.

The imported collection currently has 65 records: 44 live demos, one archived demo, eight native prototypes, eight local projects, two projects in development and two research projects. Update this snapshot when the catalog changes; the site itself calculates its counts from the catalog.

## Publish

Publish only the contents of the freshly built `dist/` directory to the existing GitHub Pages `gh-pages` branch. Keep source changes on the source branch. `public/.nojekyll` is copied into the build so nested demo assets such as Next.js `_next/` files are served intact.

The portfolio is intended for the domain root. Several embedded demos were built for `/projects/<id>/`; a different hosting prefix requires rebuilding those demos with the matching base path. Existing external project links remain external.

Before publishing, check the production preview, project search and details, local fonts, the catalog response, and the demos or downloads that changed. Keep internal audit reports, private repositories, credentials, development folders and local working files outside `public/`.

## Opening and media

The introduction uses actual page elements and runs for about three seconds on the first visit; Skip, Replay, immediate navigation and reduced motion are supported. Its choreography and the explicit-play YouTube listening panel are in `src/experience.js`. The authorized recording is Kenji Bunch, Blue Hour Duo (2022), linked from Ian’s channel. All game clips are actual recordings, with controlled playback and poster fallbacks.

Optional project fields include `video`, `mascotSheet`, `downloadUrl`, and `comparison` (`before`, `after`, labels and caption). Use authentic historical captures for comparisons. Run `npm run build` then `npm run check` after catalog changes.
