# Design Brief: Nelson Farm and Grill

*Created: 2026-03-26*

## Site Overview

**Purpose:** A personal family recipe collection site — a living cookbook for the Nelson family, organized by category and accessible to family and friends.

**Target audience:** Nelson family members and close friends who want to browse, find, and follow the family's recipes.

**Primary user goal:** Find and read a recipe quickly — browse by category, open the detail view, and cook from it.

**Emotional tone:** Warm, personal, home-cooked. Not a polished food blog — the charm is that it's genuinely a family's own recipes and photos. The design should feel inviting and a little rustic without being precious about it.

---

## Current State Assessment

### What's working

- **Gold-on-dark color scheme** — `#ffc800` (gold) on `#212529` (near-black) is warm and distinctive. It avoids the generic white/neutral food blog look and feels like a hearth.
- **Font pairing** — Montserrat (headings, nav) + Roboto Slab (body, subheadings) is well-chosen. Geometric/serif contrast gives the site personality without being hard to read.
- **Animated grill masthead** — the `grill.gif` hero background immediately establishes the cooking theme. It's a small detail that does a lot of work.
- **Section structure** — Starters → Mains → Desserts → Cocktails → Miscellaneous → Family is logical and easy to scan. The nav auto-generates from categories, keeping it DRY.
- **Family section** — the team-card layout for family member photos adds soul to the site. It reinforces that this is a real family's collection, not a generic recipe aggregator.
- **Food photography** — the recipe card images are high quality and make the grid visually compelling.
- **Responsive foundation** — Bootstrap 5 grid with correct viewport meta tag; mobile layout is structurally sound.

### What needs attention

- **Recipe card hover affordance** — `.portfolio-hover` CSS is scoped to `#portfolio`, but recipe cards live in `.page-section` elements. Hover overlay never fires. Cards look clickable but give no visual feedback. (Issue #14 filed)
- **Recipe card caption inconsistency** — captions use hardcoded inline `style="background-color: rgba(0,0,0,0.5)"` and `style="color: yellow"` — not using the design system's CSS variables or the theme's `.portfolio-caption` class properly. The gray `#b5b5b5` caption background from the base theme is being overridden ad-hoc.
- **Portfolio hover overlay color** — `rgba(255, 204, 255, 0.8)` is pinkish/magenta. This is the Agency theme default and is inconsistent with the gold-on-dark brand palette. Should be gold or dark with gold accent.
- **Modal infrastructure** — multiple critical bugs: double trigger (#13), broken img tag (#17), duplicate aria label IDs (#16), deprecated `role='document'` (#23). The recipe detail experience is largely broken.
- **"Miscellaneous" section label** — the section heading and subheading both read "Miscellaneous" (placeholder, issue #19). Even after fixing the placeholder, the label is generic. This category contains sauces, brines, and dressings — a more descriptive name would help discoverability.
- **Footer** — a single centered copyright line with no styling. The `footer` element is missing `class="footer"` so the CSS never applies (issue #18). Even once fixed, the footer is minimal.
- **Accessibility gaps** — navbar brand image missing `alt` (#21), text-muted on dark overlay fails contrast (#22), deprecated modal attributes (#23), all modals share one `aria-labelledby` target (#16).
- **Meta description empty** — `<meta name="description" content="">` is unfilled despite `_config.yml` having a site description (#24).
- **Dead JS code** — `scripts.js` contains a `.close` querySelector that matches nothing in Bootstrap 5 (#25), empty modal event listeners (#26), and an async handler with no await (#27). ScrollSpy uses a deprecated `offset` option (#29).

---

## Design Direction

### Visual Identity

**Typography:**
- Headings: Montserrat, 700 weight — uppercase for section headings, title case for card titles
- Body/subheadings: Roboto Slab — good for recipe text, feels "handwritten recipe card" adjacent
- **Opportunity:** Recipe detail pages (once working) could benefit from slightly larger body type size (currently inherits `1rem`) for readability while cooking

**Color palette:**
- Primary: `#ffc800` — gold, used for brand, CTAs, hover states, timeline accents
- Dark: `#212529` — near-black, navbar background, recipe section backgrounds
- Light: `#f8f9fa` — family section background, modal background
- Body text: `#212529`
- Muted text: `#6c757d` (use with care — fails contrast on dark overlay backgrounds)
- **Recommended correction:** Portfolio hover overlay from `rgba(255, 204, 255, 0.8)` → `rgba(255, 200, 0, 0.7)` (brand gold) or `rgba(33, 37, 41, 0.85)` (dark) with gold icon/text

**Spacing & rhythm:**
- Sections use `padding: 6rem 0` (desktop: `9rem 0`) — generous, gives each category room to breathe
- Recipe grid uses Bootstrap's `row`/`col-lg-4 col-sm-6` — three-up on desktop, two-up on tablet, stacked on mobile

**Imagery style:**
- Food photography: natural light, close-up, real food (not stock). Keep this standard — it's what makes the site feel authentic.
- Team photos: casual, personal. Don't over-formalize.
- Favicon: the bear image is charming and on-brand.

---

## Information Architecture

### Current nav structure

```
[Bear Logo]  Starters  Mains  Desserts  Cocktails  Miscellaneous  Family
```

- All links are anchor-scroll to sections on the single-page index
- Recipe detail pages exist at `/NFG/recipes/<slug>/` but are not linked from the nav
- "Family" appears in the nav but is a non-recipe section (family member profiles)

### Recommended changes

1. **Rename "Miscellaneous"** → "Sauces & Basics" or "Kitchen Basics" — the current recipes in this category (Korean BBQ sauce, teriyaki sauce, simple salt brine, sesame-ginger dressing) are pantry foundations, not orphaned one-offs. A descriptive name helps users decide if it's worth scrolling to.

2. **Recipe detail page discoverability** — once recipe modals are working, recipe detail pages at `/recipes/<slug>/` remain inaccessible except via direct URL. Consider whether cards should link to detail pages (better SEO, shareable URLs) vs. modals (faster browsing). This is a strategic IA decision, not a bug.

3. **Search/filter** — at 16 recipes the grid is manageable. As the collection grows past ~30 recipes, a simple text filter or category-jump nav will become important. Flag as a future enhancement.

4. **"Family" section placement** — currently appears after the last recipe category. This makes sense as a footer-adjacent personal section. No change recommended.

---

## Priority Improvements

| Priority | Area | Finding | Impact |
|---|---|---|---|
| High | Interactivity | Double modal trigger + broken img + duplicate aria IDs (#13, #16, #17) | Recipe detail pages are unusable |
| High | Visual Design | Portfolio hover overlay color inconsistent with brand (`rgba(255,204,255,0.8)` → gold) | Every recipe card hover looks wrong |
| High | Visual Design | Recipe card captions use hardcoded inline styles instead of design system | Inconsistent appearance, hard to maintain |
| Medium | Accessibility | Navbar brand missing alt, text-muted contrast failure, deprecated modal role (#21, #22, #23) | Screen reader and contrast failures |
| Medium | Information Architecture | "Miscellaneous" section has no real label (#19) | Category purpose unclear to visitors |
| Medium | Performance | Font Awesome legacy URL, Google Fonts v1 API (#31, #32) | Render-blocking FOUT, outdated resources |
| Low | Footer | Footer CSS never applies, minimal content (#18, #33) | Unbranded closing experience |
| Low | Content | Placeholder subtitle in recipe (#20), empty meta description (#24) | SEO and content quality |

---

## Proof of Concept Opportunities

Areas where a visual PoC would help communicate the design direction:

1. **Recipe card hover state** — show the gold-overlay hover affordance on `.portfolio-link` so stakeholders can see what the fixed interaction should look like. This requires a CSS selector change from `#portfolio .portfolio-item` to `.portfolio-item`.

2. **Recipe card caption redesign** — replace inline styles with CSS classes, shift from gray `#b5b5b5` background to the existing dark overlay approach but using theme variables (`--bs-dark` with opacity). Demonstrate before/after.

3. **Footer enhancement** — even a minimal footer with a subtle logo mark, nav links, and copyright line would feel significantly more complete than the current single-line placeholder.

---

## Out of Scope

Features or changes explicitly deferred:

- **Search/filter** — valuable but architectural; deferred until recipe count justifies it
- **Image generation mockups** — future capability (see ux-designer skill)
- **Recipe detail page redesign** — dependent on modal bugs being resolved first; design pass comes after the infrastructure works
- **User accounts / recipe submission** — well beyond the current scope

---

## Open Issues Reference

All 20 currently-open issues are tracked on GitHub. This design brief focuses on design direction and opportunities not yet captured as issues. Issues already filed:

- #13 Bug: Double modal trigger
- #14 UX: No hover affordance on recipe cards
- #15 Bug: Family social links placeholder hrefs
- #16 Accessibility: Shared recipeModalLabel across all modals
- #17 Bug: Modal broken img when no images
- #18 UX: Footer CSS never applies
- #19 Content: Miscellaneous subheading placeholder
- #20 Content: Butternut squash recipe placeholder subtitle
- #21 Accessibility: Navbar brand missing alt
- #22 Accessibility: text-muted contrast failure
- #23 Accessibility: Deprecated role='document' on modals
- #24 Code: Empty meta description
- #25–#29 Code: Dead JS code and deprecated options
- #31–#34 Code/Maintenance: Font Awesome, Google Fonts, Gemfile.lock, footer year
