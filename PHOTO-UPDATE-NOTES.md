# RCS Remodeling — site cleanup & photo update notes

_Last updated: 2026-07-14_

## Update — desktop dropdown fix

- The **Services dropdown** on desktop was rendering its items sideways (spilling
  off-screen) because the "keep the top nav on one line" rule's `white-space:nowrap`
  was inheriting into the submenu. Fixed so the dropdown items (Remodeling, Debris
  Removal, Demolition, Cleanup, Squatter Removal) stack vertically as expected.

## Update — About spacing & Why-Choose image alignment

- **"About Us" title → body gap tightened** to a tidy ~14px on both desktop and
  mobile (a `min-height` on the title row was forcing large empty space below it).
- **"Why Choose" image top-aligned with the section title** — the photo now starts
  level with the "Why choose RCS Remodeling?" heading on desktop.

## Update — bigger "Why Choose" photo

- The single photo in the "Why Choose RCS Remodeling?" section now fills its
  column and is much larger (≈484×600 on desktop, full-width on mobile) so it
  anchors the section.

## Update — menu one-line, mobile menu & contact form

- **All header menu items now sit on one line** on desktop (they were wrapping
  to two rows).
- **Contact form restored.** It was hidden by an inline `display:none` that Divi's
  (missing) reCAPTCHA JavaScript was supposed to remove, plus a malformed tag from
  the export that leaked raw code as text. Both fixed — the form now shows on every
  page's footer, on desktop and mobile.
  - ⚠️ **Submission still needs a backend.** The form posts to WordPress
    (`/contact/` + reCAPTCHA); on static hosting it displays but won't actually
    send. To make it send, either host on WordPress or connect it to a static form
    service (Formspree / Netlify Forms / Web3Forms) — happy to wire this up.
- **Mobile "Services" menu fixed.** The service links (Remodeling, Debris Removal,
  Demolition, Cleanup, Squatter Removal) were hidden in the mobile menu
  (`display:none` + `visibility:hidden`); they now appear indented under Services
  and navigate correctly.

## Update — sticky header & About-section alignment

- **Header now sticks to the top** on scroll (was scrolling away). On mobile it
  floats as a rounded card with a small margin around it; on desktop it stays a
  full-width frosted bar.
- **Desktop hero headline** given extra top clearance so it never tucks under the
  header on narrow laptop widths (~981–1010px).
- **Homepage "About US" section:** on desktop the photo now lines up with the top
  of the body text (removed a 100px offset) so the left/right columns are level;
  on mobile the large gap between the "About US" title and the body text was
  tightened (removed an empty spacer, ~138px → ~52px).

## Update — hero, header & dedicated Gallery page

- **Hero video kept & pulled to the top.** The background video now reaches the
  very top edge of the page on desktop & mobile; the header floats over it as a
  frosted translucent bar (matching the site's original blur design).
- **Shorter, aligned mobile header.** The mobile header dropped from ~146px to
  ~74px and the logo, BBB/Terrell badges, and hamburger now sit on one centered row.
- **Uniform service-card images.** The four homepage "Our Services" cards are all
  cropped to the same size (the Remodeling photo was portrait and rendering tall).
- **New Gallery page** at `/gallery/` (`gallery/index.html`): an "Our Gallery"
  hero + "Our Recent Work" grid of 36 real project photos (responsive: ~4 columns
  desktop, 2 on mobile). Added **Gallery** to the main menu (desktop + mobile) on
  every page. The homepage "Why Choose Us" gallery was trimmed to a single teaser
  image that links to the new Gallery page.

## What was done

### 1. Fixed the "glitches"
This site is a static export of a WordPress/Divi site, and the export **did not
include any of the site's JavaScript**. That single missing piece caused several
visible problems, which are now fixed with small, self-contained files
(`/assets/rcs-fixes.css` + `/assets/rcs-fixes.js`, loaded on every page):

- **Photo gallery showed nothing.** The homepage gallery relied on a Divi grid
  script (`salvattore.js`) that wasn't in the export, so all but the first photo
  collapsed to zero size. It now renders as a clean responsive grid with no
  script dependency. **This is the "link that shows the pictures we uploaded."**
- **Mobile menu (hamburger) was dead** and had no menu items at all. The menu is
  now rebuilt from the desktop navigation and opens/closes on tap.
- **Several page hero backgrounds were broken** because they pointed at image
  files that don't exist in the export. Fixed on the pages in scope (see below).

### 2. Replaced generic stock photos with the real uploaded photos
Real photos now appear on:

| Location | Now shows |
|---|---|
| Homepage hero (desktop + mobile) | Real dining room with chandelier (replaced a stock kitchen video) |
| Homepage "remodeled interior" showcase | Real living room with fireplace |
| Homepage "Remodeling" service card | Real living room |
| Homepage "Why Choose RCS" background | Real staircase & hallway |
| Homepage **gallery** | 20 curated real photos (rooms + bathrooms) |
| Remodeling page hero background | Real staircase & hallway |
| Remodeling page feature + Kitchen / Bathroom / Additions cards | Real interiors & a real clawfoot-tub bathroom |
| About page hero background | Real living room |
| About page 6-image collage | Real interiors & bathrooms |

### 3. Renamed the `public/` photo library
The 45+ files in `public/` (originally `IMG_1782.jpeg`, `dfgadfgadfg.jpeg`, etc.)
were renamed to descriptive names like `dining-room-chandelier.jpg`,
`bathroom-clawfoot-tub.jpg`, `staircase-wainscoting.jpg`. One exact duplicate
("Copy of IMG_1802.jpeg") was removed. These are the **full-resolution originals**.

Web-optimized copies (resized to 1600px, correct orientation baked in) live in
`wp-content/uploads/real/` — these are what the website loads. Total web image
weight for the set dropped from ~118 MB to ~10 MB.

## Important: photos you still need
All the uploaded photos are **finished remodels and bathrooms** (one restored
historic home). There were **no real photos for Demolition, Debris Removal,
Cleanup, or Squatter Removal**, so per direction those four service pages were
left untouched and still use their original stock/placeholder images. To make
them real too, send job-site photos for those services.

## Known remaining items (out of the agreed scope)
These pre-existing glitches were **not** changed because they're on the four
skipped service pages / Contact page:

- **Demolition page** hero background → missing file `RCS_Demolition_4.jpeg`
- **Squatter Removal page** hero background → missing file `Untitled-design-115.png`
- **Contact page** hero background → missing files `RCS_background_contact_1.png`

Say the word and I'll fix those too.

## Note on future WordPress edits
Because these are exported static files, edits made here won't appear in the
WordPress admin, and **re-exporting from WordPress would overwrite these fixes**.
If the site is still managed in WordPress, the same photo swaps should ideally be
made there as well.
