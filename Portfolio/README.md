# Aniket Barai — editorial portfolio

A deployable single-page portfolio for Aniket Barai, a Mumbai-based full-stack developer and founder of PrimeCodeStudio. Built with React 19, Vite 8, Tailwind CSS, GSAP/ScrollTrigger, Lenis, Three.js via React Three Fiber + drei, and Framer Motion. The palette uses paper `#F5F2EB`, near-black `#171714`, and electric orange `#FF4D00`. All existing `/Asset/*` URLs are preserved.

## Project structure / complete source map

Every link below opens the **full source file**, not a sample snippet.

```text
Portfolio/
├── Asset/                         Original portrait, screenshots and CV + optimized WebP alternatives
├── public/                        Favicon, crawler rules and static sculpture fallback
├── src/
│   ├── components/                Navigation, project UI, custom cursor, preloader and 3D scene
│   ├── data/                      Case study copy, links and image metadata
│   ├── hooks/                     Media flags, native scroll spy and desktop GSAP choreography
│   ├── App.jsx                    Semantic hero/work/about/skills/experience/education/contact sections
│   ├── index.css                  Tokens, typography, layout and responsive/reduced-motion styles
│   ├── main.jsx                   React entry + self-hosted fonts
│   └── sceneState.js              Shared 3D scroll waypoints
├── index.html                     SEO/Open Graph metadata and no-flash theme setup
├── package.json                   Scripts and dependencies
├── package-lock.json              Reproducible npm dependencies
├── postcss.config.cjs
├── tailwind.config.js
├── vercel.json
└── vite.config.js                 Copies /Asset/* unchanged into production output
```

| Source | Purpose |
| --- | --- |
| [`package.json`](package.json), [`package-lock.json`](package-lock.json) | Installable package and pinned dependency graph |
| [`index.html`](index.html), [`src/main.jsx`](src/main.jsx), [`src/App.jsx`](src/App.jsx) | Metadata, bootstrapping, and complete page content |
| [`src/index.css`](src/index.css), [`tailwind.config.js`](tailwind.config.js), [`postcss.config.cjs`](postcss.config.cjs) | Editorial design system and Tailwind build |
| [`src/data/projects.js`](src/data/projects.js), [`src/sceneState.js`](src/sceneState.js) | Project content and 3D section targets |
| [`src/hooks/useMediaFlags.js`](src/hooks/useMediaFlags.js), [`src/hooks/useScrollExperience.js`](src/hooks/useScrollExperience.js), [`src/hooks/desktopScrollExperience.js`](src/hooks/desktopScrollExperience.js) | Device detection, native scroll fallback, and lazy desktop Lenis/ScrollTrigger interactions |
| [`src/components/Navbar.jsx`](src/components/Navbar.jsx), [`src/components/MobileMenu.jsx`](src/components/MobileMenu.jsx) | Scroll-spy links, dark mode, lazy Framer Motion mobile menu |
| [`src/components/Preloader.jsx`](src/components/Preloader.jsx), [`src/components/CustomCursor.jsx`](src/components/CustomCursor.jsx) | Brief CSS splash and pointer-only labeled/magnetic cursor |
| [`src/components/ProjectCard.jsx`](src/components/ProjectCard.jsx), [`src/components/ProjectImage.jsx`](src/components/ProjectImage.jsx), [`src/components/ProjectIndex.jsx`](src/components/ProjectIndex.jsx), [`src/components/ProjectDetail.jsx`](src/components/ProjectDetail.jsx) | Tilt gallery, responsive image fallbacks, pointer preview, and on-demand animated case-study dialog |
| [`src/components/SceneLayer.jsx`](src/components/SceneLayer.jsx), [`src/components/ThreeScene.jsx`](src/components/ThreeScene.jsx), [`public/ribbon-fallback.svg`](public/ribbon-fallback.svg) | Lazy persistent sculptural ribbon and lightweight static fallback |
| [`vite.config.js`](vite.config.js), [`vercel.json`](vercel.json), [`public/robots.txt`](public/robots.txt), [`public/favicon.svg`](public/favicon.svg) | Asset URL preservation, deployment, crawlers and branding |

## Run locally

Requires Node.js **20.19+** or **22.12+** and npm.

```bash
cd Portfolio
npm ci
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Check the production build locally:

```bash
npm run build
npm run preview
```

The preview command serves `dist/` (normally on port 4173). No environment variables, backend, API credentials or additional services are required.

## Deploy to Vercel

1. **Publish these workspace changes first**: commit and push the current working branch, then merge it into the branch Vercel should deploy (usually `main`). Alternatively, tell Vercel to deploy that pushed branch. Importing the untouched `main` before this step would deploy the old site.
2. Import the `aniketbarai/WebProjects` repository from GitHub into Vercel. Set **Root Directory** to **`Portfolio`** (not the repository root). Select **Vite** as the framework.
3. Use Node.js **22.x**. Install command: `npm ci`. Build command: `npm run build`. Output directory: `dist`. These match [`vercel.json`](vercel.json).
4. Deploy. `vite.config.js` emits all original files into `dist/Asset/`, so `/Asset/Aniket_Barai_CV.pdf`, the new `/Asset/Aniket_latest.jpg`, the former `/Asset/aniketFinal.JPG`, and the original PNG URLs continue to work.
5. After Vercel assigns a permanent domain, change the `og:image` and `twitter:image` URLs in [`index.html`](index.html) to their **absolute** `https://your-domain/Asset/aniketFinal.JPG` form (and add `og:url` if desired). The new photo is used only in the existing framed portrait slot; social-preview metadata retains its previous image. Social crawlers vary in their handling of relative preview-image URLs.

The Arena preview URL is for review; it is not a permanent Vercel deployment. Edit [`src/data/projects.js`](src/data/projects.js) to change project case studies and [`src/App.jsx`](src/App.jsx) to change section copy. Keep existing filenames in `Asset/` for backwards compatibility. Optimized WebP images are selected through `<picture>` while the originals remain fallbacks.

## Motion, performance and accessibility

- On capable desktops, Lenis shares GSAP's ticker. ScrollTrigger pins the horizontal project rail, runs masked reveals, image wipes, counters, parallax words, and reverses the skills marquee when scroll direction changes. The procedural R3F ribbon morphs and repositions between sections; pointer motion supplies subtle parallax. Project cards have restrained pointer tilt and layered depth; the quick index has a portal-based cursor-following preview.
- Mobile, reduced-motion, and low-power devices use native scrolling and an unpinned project grid, **without downloading GSAP/Lenis**. The 3D scene falls back to a decorative 1.6 KB SVG; on mobile, project screenshots and the portrait use small WebP variants. Capable desktops load the WebGL bundle only when idle; DPR is capped at 2. Rendering stops when the tab is hidden, the scene leaves the page, or a full-screen overlay obscures it.
- The preloader lasts at most ~1.4 s on capable desktops and is skipped elsewhere. Framer Motion loads only when opening the mobile menu or project detail. Both dialogs manage focus, trap Tab, restore focus on close, accept Escape, and make background content inert. All content stays readable without JavaScript animations or WebGL. Semantic sections, descriptive alt text, keyboard access and visible focus outlines are included.
- Performance scores vary by device and hosting. Run mobile/desktop Lighthouse and an accessibility audit against your actual deployed domain; **90+ is a target, not a guarantee**.
