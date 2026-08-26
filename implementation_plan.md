# Implementation Plan

[Overview]
Add a new static English page (`ai-finder.html`) to the Usuyna website that helps people find the best AI model for their needs (text, images, code, etc.), presented as a comparison/recommendation page. It will reuse the exact existing visual identity (navy/cyan theme, Baloo 2, `.page-shell`, `.noise`, header, footer, reveal animations) and be reachable from the homepage via a button/link added in the "Solutions" section and navigation.

Scope: pure HTML/CSS/vanilla JS, no build tools, no new dependencies. Follows the pattern already established by `legal.html` (secondary page with back link, same header/footer, shared `styles.css` and `script.js`).

[Types]
No type system (plain HTML/CSS/JS). Data structure used: an optional JS array `AI_MODELS` of plain objects `{ name, vendor, category, strengths, bestFor, url }` if a small filter interaction is desired — kept minimal, defined inline in the page or in `script.js`.

[Files]
- NEW `c:\site usuyna\ai-finder.html` — the AI model finder page. Structure copied from `legal.html`: same `<head>` pattern (theme-color `#061426`, description meta, title "Find your best AI model — Usuyna", link to `styles.css`), same header (links pointing back to `index.html`), same footer. Main content:
  - Head section styled like `.legal-head`: "← Back to Usuyna" link, kicker "AI model finder", big h1 with `<em>` accent.
  - Intro paragraph explaining the goal (helping people pick the right AI model).
  - Sections per use case: Best for everyday chat / writing, Best for coding, Best for image generation, Best for open-source / local use, Best value / free options — each as cards using existing card-like styling (border `var(--line)`, sky headings, muted body).
  - A comparison table or card grid listing models (name, vendor, strengths, best for, link to official site).
  - Disclaimer note that recommendations evolve quickly and are updated periodically.
- MODIFY `c:\site usuyna\index.html`
  - Add a prominent button on the homepage linking to `ai-finder.html`. Primary placement: inside the hero actions area or as a highlighted entry in the Solutions section (e.g., turn solution card 01 area or add a dedicated call-to-action under `.solution-grid`). Use existing classes `.button.button-primary` plus a small new class if needed.
  - Add a link to `ai-finder.html` in the "Explore Usuyna" nav dropdown (and optionally in the footer links next to "Legal notice").
- MODIFY `c:\site usuyna\legal.html` — add the same nav/footer link to `ai-finder.html` for consistency (optional but recommended).
- MODIFY `c:\site usuyna\styles.css` — append new styles for the finder page, reusing CSS variables only: `.finder-*` classes (head, intro, category sections, model cards grid, table styling, responsive rules at 800px/450px breakpoints matching existing media queries).

[Functions]
- No modifications required in `c:\site usuyna\script.js` — it is generic (menu toggle, dropdowns, IntersectionObserver reveals all work automatically on any page including the new one).
- OPTIONAL new function `filterModels(category)` in `script.js` if category filter buttons are wanted (simple class toggling; skip unless requested).

[Classes]
None (no JS classes). New CSS classes: `.finder-head`, `.finder-intro`, `.finder-sections`, `.model-grid`, `.model-card`, `.model-tag`, `.model-table` (or card-based layout preferred for mobile consistency).

[Dependencies]
None added. Google Fonts import and everything else stay unchanged.

[Testing]
- Open `index.html` in a browser: verify the new button navigates to `ai-finder.html`.
- On `ai-finder.html`: verify header dropdowns, mobile menu toggle, scroll-reveal animations work (they run from shared `script.js`).
- Test responsiveness at ~800px and ~450px widths against existing breakpoints.
- Validate all internal links (`index.html`, `legal.html`) resolve.

[Implementation Order]
1. Create `ai-finder.html` full page content (header/footer copied from `legal.html`, adapted head + body sections).
2. Append `.finder-*` styles to `styles.css`, including responsive media queries.
3. Add homepage button + nav/footer links in `index.html`.
4. Mirror nav/footer links in `legal.html`.
5. Manual browser validation (desktop + mobile widths, animations, links).
