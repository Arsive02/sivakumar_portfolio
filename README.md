# Portfolio v3 — Math Editorial

A single-scroll portfolio with case-study routes, built with React 19, Vite 6, Tailwind v4, GSAP (ScrollTrigger + SplitText), Lenis and React Three Fiber.

## Commands

```bash
npm run dev            # local dev server
npm run build          # typecheck + production build
npm run preview        # serve dist/
npx vite build --mode analyze   # writes dist/stats.html (bundle treemap)

npm run assets:images  # legacy PNG/JPG → AVIF/WebP srcsets in public/media/img, PDFs → public/docs
npm run assets:video   # flute video → 720p MP4 + WebM + poster in public/media
npm run meshy:preview -- flute telescope   # Meshy text-to-3D previews → assets-src/models/*.preview.glb
npm run meshy:refine  -- flute             # textured refine of an approved preview
npm run assets:models  # optimise refined GLBs → public/models (meshopt + WebP, ≤1.5 MB)
```

The Meshy key is read from `MESHY_API` in the environment or in `../.env`. Only the offline scripts use it; it never reaches the client bundle.

## Structure

| Path | Contents |
|---|---|
| `src/content/` | All copy and data (typed): profile, experience, projects, skills, achievements, hobbies, resources |
| `src/sections/` | Homepage sections, in order: Hero, About, Work, Experience, Skills, Honours, Life, Contact |
| `src/pages/` | `/`, `/work/:slug`, `/library`, 404 |
| `src/gl/` | The single WebGL canvas (`GLStage`), `GLSlot` placeholders, scenes, GLSL |
| `src/motion/` | Lenis ↔ ScrollTrigger sync, SplitText reveals |
| `src/ui/` | Nav, cursor, ⌘K palette, theme toggle, primitives |

## Math visuals

| Section | Visual |
|---|---|
| Hero | About 37k GPU particles run heavy-ball SGD on ½‖θ−θ*‖² toward glyph samples of the name, with annealed curl-noise "temperature". Scrolling un-trains them. |
| About | Fourier epicycles trace a glyph contour (Moore tracing → arc-length resample → DFT). Scrolling raises the number of harmonics. |
| Work | Per-project fragment shaders: KL integrand, starfield constellations, softmax attention, Himmelblau contours, flow LIC, Voronoi, plus an RK4 Lorenz attractor. |
| Experience | Roles are spread on a Fibonacci lattice over the Bloch sphere. The state vector slerps along geodesics. |
| Skills | Self-attention matrix. Scrolling anneals the softmax temperature τ from 4 to 0.08. |
| Honours | Voronoi tessellation relaxed by Lloyd's algorithm, scrubbed by scroll. |
| Contact | A true parametric Möbius strip. |

All scenes share one WebGL context through drei `<View>`. WebGL loads after idle; the DOM is the fallback, and `prefers-reduced-motion` gets settled, static states.
