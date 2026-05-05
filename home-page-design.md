# IRIS 34 — Homepage Design Specification
> Batch 34 · Department of Statistics · SUST  
> For AI agent: build section-by-section in the order described. Each section is self-contained. Do not skip details.
> Do not change other pages like curriculum or calculator. This spec is only for the homepage (`/`).

---

## 0. Design System 

### Color Palette
```
--bg-base:        #0a1614   /* near-black dark teal */
--bg-surface:     #0f1f1c   /* slightly lighter teal-black */
--bg-card:        #132720   /* card/panel background */
--border:         #1e3d35   /* subtle divider/border */
--accent-teal:    #2a6b5e   /* primary teal accent */
--accent-warm:    #c9a96e   /* goldenish-white warm accent */
--text-primary:   #e8dcc8   /* warm off-white, NOT pure white */
--text-secondary: #8a9e98   /* muted teal-grey */
--text-muted:     #4a6560   /* very muted */
```
No neon. No glow. No box-shadow bloom. Depth is achieved through layered opacity and subtle contrast, not glow effects.

### Typography
- **Display / Hero**: `"Cormorant Garamond"` (Google Fonts) — weight 600/700, elegant academic serif
- **Headings**: `"DM Serif Display"` — for section titles
- **Body / UI**: `"Figtree"` — clean, modern sans-serif for all body and buttons
- **Monospace**: `"JetBrains Mono"` — for stats counters, code-like labels, year filters

Load from Google Fonts:
```
Cormorant+Garamond:wght@400;600;700
DM+Serif+Display
Figtree:wght@300;400;500;600
JetBrains+Mono:wght@400;500
```

### Motion Principles
- No bouncy spring animations. Motion is smooth, deliberate, slightly slow.
- Transitions: `cubic-bezier(0.4, 0, 0.2, 1)` — eased in-out
- Duration: 400–700ms for most transitions; loading screen up to 2s
- Scroll: snap-based full-section scrolling for Hero → Memories transition only
- Hover states: opacity + subtle translate-Y(-2px), no scale

### Layout
- Max content width: `1200px`, centered
- Section padding: `80px 48px` on desktop, `48px 20px` on mobile
- Consistent 8px grid

---

## 1. Loading Screen

**Trigger**: Plays once on first visit. Fades out after ~2.5s. Can be skipped by clicking.

### Visual Concept
A statistics-themed loading animation. Dark background (`--bg-base`). Centered layout.

**What to render:**
1. **Top center**: A thin horizontal line that extends left and right from center like an axis (animates in 0–400ms)
2. **Animated histogram bars**: 7 vertical bars of varying heights rise from the axis line, staggered 80ms apart. Heights: `[40%, 65%, 85%, 100%, 80%, 55%, 30%]`. Color: `--accent-teal` at 80% opacity. Width: `28px`, gap: `10px`.
3. **Overlaid normal curve**: An SVG `<path>` of a bell curve is drawn over the bars (stroke-dashoffset animation, color `--accent-warm`, stroke-width 2, no fill)
4. **Below bars**: Text appears with typewriter effect — `"Initializing IRIS 34..."` — in `JetBrains Mono`, size 13px, color `--text-secondary`
5. **Progress line**: A thin `1px` horizontal line beneath the text fills from left to right over 2s (width: 0 → 180px), color `--accent-warm`

**Exit**: Entire loading screen fades to opacity 0, then `display: none`. Main content fades in simultaneously.

---

## 2. Hero Section

**Behavior**: Full viewport height (`100vh`). Scroll-snap target. One complete scroll or click of "Explore IRIS 34" transitions the viewport to the next section with a smooth full-page slide (scroll-snap-type: y mandatory on the outer wrapper, for Hero + Memories only).

### Background
- Base: `--bg-base` solid
- Texture: A very subtle SVG noise grain overlay at 3% opacity (use CSS `background-image: url("data:image/svg+xml...")`)
- **Statistical grid pattern**: A faint grid of dots (CSS `radial-gradient` repeated background) at 4% opacity, dot size 1px, spacing 32px, color `--accent-teal`
- **Decorative element — top-right**: A large faint outline of a normal distribution curve (SVG, stroke only, `--accent-teal` at 8% opacity), roughly 600px wide, positioned in the top-right corner, partially cut off by viewport edge. No animation.
- **Decorative element — bottom-left**: A scatter plot of ~18 faint dots with a faint regression line through them (`--accent-warm` at 10% opacity). Static. Purely decorative.

### Content Layout
Vertically centered, left-aligned starting at ~15% from left edge.

```
[small label]
[large heading]
[typewriter paragraph]
[three buttons]
```

**Small label** (above heading):
```
SUST · Department of Statistics · Batch 34
```
Font: `Figtree` 12px, letter-spacing: 0.2em, uppercase, color `--text-muted`. Has a short `--accent-warm` 1px line to its left (16px wide).

**Main Heading:**
```
Welcome to
IRIS 34
```
"Welcome to" — `Cormorant Garamond` 600, size: `clamp(2rem, 5vw, 4rem)`, color `--text-secondary`  
"IRIS 34" — `Cormorant Garamond` 700, size: `clamp(3.5rem, 9vw, 7.5rem)`, color `--text-primary`, line-height 0.95

Animate in: both lines fade + slide up (translateY 20px → 0) staggered 150ms, starting after loading screen.

**Typewriter Text (below heading):** once the whole text is typewrited, it stays as a paragraph, no more typewriter effect after that.

A short paragraph typed character-by-character (30ms per char delay, cursor blink). Starts after heading animation completes (~600ms after page load).

Text content:
```
IRIS - the most iconic dataset in Statistics, Machine Learning, and Data Science education. Just as the 150-year-old dataset has been a foundational learning tool for generations of statisticians.
IRIS — a flower that blooms in many colours, just as statistics  
reveals hidden patterns in every dimension of the world.  
We are Batch 34, and this here's our story.
```
Font: `Figtree` 300, size 16px, color `--text-secondary`, max-width 480px, line-height 1.7.  
Cursor: `|` character, blinks at 500ms interval, disappears when typing ends.

**Three Buttons (row, flex, gap 16px, margin-top 40px):**

1. **"Explore IRIS 34"** — Primary  
   Style: Filled rectangle, background `--accent-teal`, text `--text-primary`, font `Figtree` 500, size 14px, padding `12px 28px`, border-radius `4px`. No border. Hover: background lightens by 15% (use `filter: brightness(1.15)`), translate-Y(-1px).  
   Action: Smooth scroll to `#memories` section. Since scroll-snap is active, this will snap the next section into full view.

2. **"Explore Curriculum"** — Secondary  
   Style: Outlined rectangle, border `1px solid --accent-warm` at 60% opacity, text `--accent-warm`, same font/padding as above. Hover: border and text opacity go to 100%.  
   Action: Navigate to `/curriculum` (existing page)

3. **"CGPA Calculator"** — Ghost  
   Style: No border, no background. Text `--text-secondary`. Underline on hover (1px, `--accent-warm`).  
   Action: Navigate to `/calculator` (existing page)

**Scroll indicator** (bottom center, absolute positioned):
A thin vertical line (40px, 1px wide, `--text-muted`) with a small downward chevron below it. Pulses opacity 0.4 → 1 → 0.4 every 2s. Disappears on scroll.

---

## 3. Memories Section

**ID**: `memories`  
**Behavior**: Full viewport height. Scroll-snap target (end of snap zone; after this section, normal scroll resumes).

### Section Header
Top of section, left-aligned:
- Eyebrow: `"— Our Journey"` · `Figtree` 12px, uppercase, letter-spacing 0.15em, `--text-muted`
- Title: `"Memories"` · `DM Serif Display`, size `clamp(2rem, 4vw, 3.5rem)`, `--text-primary`
- Subtitle: `"Hover over a photo to see the occasion"` · `Figtree` 14px, `--text-secondary`

**Year Filter (top-right of section header row):**
A row of pill buttons: `All · 2024 · 2025` (expand as needed). Style: `JetBrains Mono` 12px. Active pill: background `--accent-teal`, text `--text-primary`. Inactive: border `1px solid --border`, text `--text-muted`, background transparent. Hover inactive: border color `--accent-teal`, text `--text-secondary`. Gap: 8px.

Filter logic: Photos are stored in `web/public/memories/` with filenames like `lalakhal_tour_03_2025.png`. Parse the last segment before `.` as `MM_YYYY`. Filter by year when pill is clicked.

### Carousel
A horizontally scrollable row of photo cards. No auto-scroll by default — drag/swipe or arrow buttons to navigate.

**Navigation arrows**: Left/right arrow buttons, positioned vertically centered on the carousel, outside the card area. Style: circle `40px`, background `--bg-card`, border `1px solid --border`, icon color `--text-secondary`. Hover: border `--accent-teal`.

**Each card:**
- Size: `340px × 240px` (desktop), `260px × 180px` (mobile)
- Border-radius: `6px`
- Border: `1px solid --border`
- Overflow: hidden
- Contains `<img>` filling the card (object-fit: cover)
- Placeholder: a dark teal rectangle with a centered faint camera icon SVG (stroke only, `--text-muted`)

**Hover state (each card):**
- The image blurs (`filter: blur(3px) brightness(0.4)`) with a `transition: 400ms ease`
- An overlay div fades in (opacity 0 → 1), containing:
  - Occasion text: Parsed from filename, e.g. `"Lalakhal Tour"`, centered, `DM Serif Display` 22px, `--text-primary`
  - Date text: e.g. `"March 2025"`, `Figtree` 13px, `--text-secondary`, below occasion
- No hard overlay background — the blurred image itself provides the dark background

**Placeholder images spec** (for now, generate placeholder cards):
```
lalakhal_tour_03_2025.png     → "Lalakhal Tour · March 2025"
freshers_reception_07_2025.png → "Freshers Reception · July 2025"
group_photo_01_2025.png       → "Group Photo · January 2025"
sports_day_11_2024.png        → "Sports Day · November 2024"
study_session_09_2024.png     → "Study Session · September 2024"
```
When actual images are unavailable, render styled placeholder divs with the parsed occasion name visible by default (no hover needed for placeholders).

---

## 4. Timeline Section

**ID**: `timeline`  
**Layout**: Normal scroll (no snap). Full width.

### Section Header (same pattern as Memories)
- Eyebrow: `"— Milestones"`
- Title: `"Our Timeline"`
- Subtitle: `"Key events from the life of IRIS 34"`

---

### Timeline Spine

A single vertical line runs down the exact horizontal center of the section, from the first event to the last.

```
Style:
  width: 2px
  background: repeating-linear-gradient(
    to bottom,
    var(--accent-teal) 0px,
    var(--accent-teal) 8px,
    transparent 8px,
    transparent 16px
  )
  /* dashed effect using gradient, NOT border-style: dashed */
```

The line starts `40px` below the section header and ends `40px` after the last event card.

---

### Event Node (the dot on the spine)

Each event has one node sitting on the spine, vertically aligned to the **top of that event's card**.

```
Structure:
  <div class="timeline-node">
    <!-- outer ring -->
    <div class="node-ring" />
    <!-- inner fill -->
    <div class="node-core" />
  </div>

Styles:
  .timeline-node:
    position: absolute
    left: 50%
    transform: translateX(-50%)
    display: flex
    align-items: center
    justify-content: center
    width: 28px
    height: 28px

  .node-ring:
    position: absolute
    width: 28px
    height: 28px
    border-radius: 50%
    border: 1.5px dashed var(--accent-teal)   /* dashed outer ring */
    opacity: 0.6

  .node-core:
    width: 12px
    height: 12px
    border-radius: 50%
    background: var(--accent-teal)
    border: 2px solid var(--bg-base)
```

No animation on the node itself — it is static. It appears as the card animates in.

---

### Date Label

Each event has a date label that floats **on the opposite side of the spine from the card**.

- If the card is on the **left** → date label is on the **right** of the spine
- If the card is on the **right** → date label is on the **left** of the spine

```
Positioning:
  position: absolute
  top: aligned with node vertically (same baseline as node center)
  [left or right]: calc(50% + 36px)   /* or calc(50% - 36px - label width) */

Style:
  font-family: JetBrains Mono
  font-size: 12px
  font-weight: 500
  color: var(--text-secondary)
  white-space: nowrap
  letter-spacing: 0.04em
  opacity: 0.85
```

Example: `"July 8th, 2025"` — no uppercase, preserve natural casing.

---

### Connector Line

A horizontal dashed line connects the node to the card's nearest edge.

```
Style:
  height: 1px
  width: 48px
  background: repeating-linear-gradient(
    to right,
    var(--border) 0px,
    var(--border) 6px,
    transparent 6px,
    transparent 12px
  )
  /* same dashed effect as the spine */
  position: absolute
  top: aligned with node center
  [left or right edge of card to spine center]
```

---

### Event Card

Cards alternate strictly: **odd events left, even events right** (1-indexed).

```
Layout:
  width: 44%
  max-width: 520px
  position: relative (for internal layout)
  margin-bottom: 72px   /* vertical gap between consecutive events */

Structure inside card:
  ┌─────────────────────────────────┐
  │  [Title bar — darker bg]        │
  │    Event Title                  │
  ├─────────────────────────────────┤
  │  [Photo grid]                   │
  │   [ img 1 ]  [ img 2 ]          │
  └─────────────────────────────────┘
```

**Title bar (top portion of card):**
```
Style:
  background: var(--accent-teal) at 18% opacity   /* rgba(42,107,94,0.18) */
  border-bottom: 1px solid var(--border)
  padding: 14px 20px
  border-radius: 6px 6px 0 0

Content:
  font-family: DM Serif Display
  font-size: 22px
  color: var(--text-primary)
  text-align: center
  letter-spacing: 0.01em
```

**Photo grid (bottom portion of card):**
```
Style:
  background: var(--bg-card)
  padding: 16px
  border-radius: 0 0 6px 6px
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 12px

Each photo cell:
  aspect-ratio: 4/3
  border-radius: 4px
  overflow: hidden
  border: 1px solid var(--border)

  img:
    width: 100%
    height: 100%
    object-fit: cover
    display: block
    transition: transform 400ms ease
  img:hover:
    transform: scale(1.03)

Placeholder (no real image):
  background: var(--bg-surface)
  display: flex
  align-items: center
  justify-content: center
  → show a faint camera SVG icon (stroke only, --text-muted, 24px)
```

**Card outer border:**
```
border: 1px solid var(--border)
border-radius: 6px
overflow: hidden   /* clips title bar + photo grid as one unit */
box-shadow: none   /* no glow, no shadow */
```

**If an event has NO photos:** Omit the photo grid entirely. The card is just the title bar, but add a short description text inside the title bar below the event name:
```
  font-family: Figtree
  font-size: 14px
  color: var(--text-secondary)
  margin-top: 6px
  font-weight: 300
```

**If an event has only 1 photo:** Use `grid-template-columns: 1fr` so the single image spans full card width.

---

### Scroll Animation

Triggered by IntersectionObserver on each event card (threshold: 0.15).

```
Initial state (before visible):
  opacity: 0
  transform: translateX(-32px)   /* left cards slide from left */
  transform: translateX(32px)    /* right cards slide from right */

Final state (when intersecting):
  opacity: 1
  transform: translateX(0)
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)

The date label and node animate in simultaneously with the card (same transition, no separate delay).
```

---

### Full HTML Structure Per Event

```html
<!-- Event 1 — LEFT side -->
<div class="timeline-event event-left" data-index="1">

  <!-- Card (left side) -->
  <div class="event-card">
    <div class="card-title-bar">
      <span class="event-title">Freshers Reception</span>
    </div>
    <div class="card-photo-grid">
      <div class="photo-cell"><img src="..." alt="Freshers Reception photo 1" /></div>
      <div class="photo-cell"><img src="..." alt="Freshers Reception photo 2" /></div>
    </div>
  </div>

  <!-- Connector (left card → spine) -->
  <div class="connector connector-right"></div>

  <!-- Node on spine -->
  <div class="timeline-node">
    <div class="node-ring"></div>
    <div class="node-core"></div>
  </div>

  <!-- Connector (spine → date label side, right) -->
  <!-- No connector here — date label floats freely -->

  <!-- Date label (opposite side — right) -->
  <div class="event-date">July 8th, 2025</div>

</div>

<!-- Event 2 — RIGHT side -->
<div class="timeline-event event-right" data-index="2">
  <div class="event-date">March 2025</div>    <!-- date on LEFT -->
  <div class="timeline-node">...</div>
  <div class="connector connector-left"></div>
  <div class="event-card">...</div>
</div>
```

---

### Placeholder Events (use for the build)

```
Event 1 — LEFT — July 8th, 2025
  Title: "Freshers Reception"
  Photos: 2 placeholders (use public/memories/freshers_reception_07_2025.png × 2)
  Description: —

Event 2 — RIGHT — March 2025
  Title: "Lalakhal Tour"
  Photos: 2 placeholders (use public/memories/lalakhal_tour_03_2025.png × 2)
  Description: —

Event 3 — LEFT — January 2025
  Title: "New Year Gathering"
  Photos: none
  Description: "IRIS 34 rang in 2025 together — food, laughter, and memories made."

Event 4 — RIGHT — November 2024
  Title: "Sports Day"
  Photos: none
  Description: "Competing with spirit across departments on the field."

Event 5 — LEFT — September 2024
  Title: "First Day of Class"
  Photos: none
  Description: "The journey begins. 34th batch walks into the Department of Statistics."
```

---

### Mobile Behaviour (below 768px)

On mobile, collapse the alternating layout to a single-column layout. The spine shifts to the **left edge** of the content area (left: 20px). All cards become full-width (width: calc(100% - 56px)), all positioned to the right of the spine. Date labels move above each card's title bar (inside the card, in small text). Connector lines become 20px wide. Node stays on the spine, left-aligned.

---

## 5. Class Representatives Section

**ID**: `representatives`  
**Layout**: Normal scroll.

### Section Header
- Eyebrow: `"— Connect"`
- Title: `"Class Representatives"`
- Subtitle: `"Reach out to the people who speak for IRIS 34"`

### Layout
A centered row of 2–3 CR cards (flex, wrap, gap 24px, justify-center).

**Each CR card:**
- Width: `280px`
- Background: `--bg-card`
- Border: `1px solid --border`
- Border-radius: `8px`
- Padding: `32px 24px`
- Top: Circular avatar placeholder (`72px`, background `--accent-teal` at 20%, border `2px solid --accent-teal` at 40%)
- Name: `DM Serif Display` 20px, `--text-primary`, centered, margin-top 16px
- Role label: `Figtree` 12px, uppercase, letter-spacing 0.1em, `--accent-warm`, centered, e.g. `"Class Representative"`
- Contact row (centered, flex, gap 16px, margin-top 20px):
  - Facebook icon link → `--text-muted`, hover `--accent-warm`
  - Phone icon (if provided) — same style
  - Email icon (if provided) — same style

**Placeholder data:**
```
CR 1: [Name], Class Representative
CR 2: [Name], Assistant Class Representative
```
Fill in actual names/contacts before launch.

---

## 6. Footer

**ID**: `footer`  
**Height**: auto, padding `48px`

### Layout
Two rows:

**Row 1 (flex, space-between):**
- Left: Logo text `"IRIS 34"` in `Cormorant Garamond` 700 28px, `--text-primary`, with tagline below: `"Batch 34 · Dept. of Statistics · SUST"` in `Figtree` 12px, `--text-muted`
- Right: Nav links — `Home · Curriculum · Calculator` — `Figtree` 13px, `--text-secondary`, gap 24px, hover `--text-primary`

**Row 2 (flex, space-between, margin-top 32px, padding-top 24px, border-top `1px solid --border`):**
- Left: `"© 2025 IRIS 34 · SUST Statistics"` — `Figtree` 12px, `--text-muted`
- Right: `"Designed & built by [Name]"` — same style, link underline on hover

---

## 7. Home page Navigation Bar
other pages nnav remains unchanged, this is only for the homepage.
**Position**: Fixed top, `width: 100%`, z-index 100  
**Height**: `56px`  
**Background**: `--bg-base` at 90% opacity + `backdrop-filter: blur(8px)` (gives slight frosted glass without neon effect)  
**Border-bottom**: `1px solid --border` at 50% opacity  

**Contents (flex, space-between, align-center):**
- Left: `"IRIS 34"` — `Cormorant Garamond` 600, 20px, `--text-primary`
- Center: Nav links — `Home · Memories · Timeline · Representatives` — `Figtree` 13px, `--text-secondary`. Active/hover: `--text-primary`, no underline — instead a `2px` bottom border `--accent-warm`
- Right: `"Curriculum"` button — outlined style matching Hero button 2, smaller padding `8px 18px`

**Scroll behavior**: Nav appears fully on page load. After scrolling past Hero, it gains a slightly more opaque background (`--bg-base` at 98% opacity, transition 300ms).

---

## 8. File / Folder Structure Expected

```
web/
├── public/
│   ├── memories/
│   │   ├── lalakhal_tour_03_2025.png
│   │   ├── freshers_reception_07_2025.png
│   │   ├── group_photo_01_2025.png
│   │   ├── sports_day_11_2024.png
│   │   └── study_session_09_2024.png
│   └── group.png
├── src/
│   ├── pages/
│   │   └── index.tsx (or index.jsx / index.html)
│   ├── components/
│   │   ├── LoadingScreen.tsx
│   │   ├── Hero.tsx
│   │   ├── Memories.tsx
│   │   ├── Timeline.tsx
│   │   ├── Representatives.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── styles/
│       └── globals.css  (CSS variables + resets + typography)
```

---

## 9. Build Order for AI Agent

Build strictly in this order. Test each section in isolation before moving to the next.

1. **globals.css** — Define all CSS variables, typography imports, reset, body background
2. **Navbar** — Fixed bar with links and scroll opacity behavior
3. **LoadingScreen** — Animation, typewriter label, progress line, fade-out logic
4. **Hero** — Background texture, decorative SVGs, heading, typewriter, three buttons, scroll indicator. Wire scroll-snap.
5. **Memories** — Year filter pills, carousel with placeholder cards, hover reveal, filename parser utility
6. **Timeline** — Centered vertical line, alternating cards, placeholder events, IntersectionObserver animation
7. **Representatives** — CR cards with placeholder data and social icon links
8. **Footer** — Two-row layout
9. **Page assembly** — Compose all components in order with correct section IDs and scroll-snap container

---

## 10. Technical Notes

- **Framework**: Match the existing site stack (Next.js / React). Use `.tsx` if TypeScript is already set up.
- **Scroll snap**: Apply `scroll-snap-type: y mandatory` only on a wrapper div that contains `Hero` + `Memories`. After `Memories`, the wrapper ends and normal document scroll takes over.
- **Filename parser utility**:
  ```ts
  // "lalakhal_tour_03_2025.png" → { occasion: "Lalakhal Tour", date: "March 2025" }
  function parseMemoryFilename(filename: string) {
    const base = filename.replace(/\.[^.]+$/, ''); // strip extension
    const parts = base.split('_');
    const year = parts.at(-1);
    const month = parts.at(-2);
    const labelParts = parts.slice(0, -2);
    const occasion = labelParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' });
    return { occasion, date: `${monthName} ${year}` };
  }
  ```
- **No external UI libraries** — build components from scratch using the design tokens above
- **No neon / glow** — explicitly avoid `box-shadow` with color, `text-shadow`, or CSS glow effects anywhere
- **Accessible**: All buttons must have `aria-label`. Images must have `alt`. Focus states must be visible (use `outline: 2px solid --accent-warm`).
