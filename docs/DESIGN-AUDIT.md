# Design audit: First Builds

Written October 11, 2026, on the branch `north-shore-look`, after the content pass. This is the audit only. Nothing on the site has changed. The short version and the decisions for Sean come first, then the verified Breaks, then the system changes that fix the most at once, then the findings surface by surface. The last sections hold what to keep, the review findings this audit corrects, and the order of work once the decisions are made.

**The bar**, in Sean's words: an elegant and easy-to-use experience; every design choice intentional; smooth interaction, clear intention; no portion of any page simply allowed to be.

**Fixed for this pass** (the reviewers were told): North Shore's palette and type, the credits (partner first, Sean's mark lower left), WCAG 2.1 AA, plain HTML/CSS/JS, made-up data, and the words from the content pass, though how text is structured was in scope. **Open:** layout, navigation, hierarchy, components, spacing, states, motion, phone layouts, and whether a region should exist.

## How it was made

A script (`scripts/design-audit/`, no dependencies) drove headless Chrome over its debugging protocol against its own copy of the local server. It captured 819 screenshots:

- the six site pages top to bottom at 375px (2x) and 1280px, light and Night, in the after state and the event-day states (Home before, during the Remix Arcade, Show & Cheer, and the close; every other page during);
- interaction states: an open Remix menu, the next-step panel, toasts, the copy-by-hand dialog, the Play window on each of the six starters (with the code shown and after Run my changes on two), the wish builder empty and filled, a jar wish, Sources with a path, a filter, the filters panel, and a search that finds nothing, Hosts and Three levels with every fold open, Home's part-changed notice, and each page's header;
- all 21 stage screens at 1280×720 and 375, the session clock in each state (waiting, called, corner, open, a wait running, over time), and a screen timer running and paused;
- the speaker notes alone at 560×780, 375, and 1280, and beside a live stage in the same browser on a timed screen;
- the six starters on their own at 960 and 375, before and after their main action;
- frame strips of the transitions people see.

It also measured every interactive element's look in its default, hover, focus-visible, and pressed states (forced in DevTools), target sizes and horizontal overflow at 375, every type style in use, reading measure, backgrounds, radii and shadows, and the contrast of text in the states the October 11 contrast pass skipped (`docs/design-audit/facts/contrast.md`). Motion was measured in a real Chrome window, because headless screenshots don't show CSS transitions as they run (`docs/design-audit/facts/motion-notes.md`).

Fourteen independent reviewers then read the evidence. Each got only `docs/design-audit/brief.md` and one packet of screenshots: not the code, not this plan, not the other reviews. Six read one page each (Home, Three levels, Starters, Grant a wish, Hosts, Sources), in light at both widths; one the stage; one the speaker notes; one the Play window and the six starters; two read Night across all six pages; one the design system across pages, with the inventory; one interaction and motion, with the inventory and the motion notes; and one followed three people across pages (a teacher on a phone trying a starter, a coach on a laptop sizing up running it, a participant on a phone during the event). Their reviews are kept whole in `docs/design-audit/reviews/`; finding IDs below point into them (H Home, L Three levels, S Starters, W Grant a wish, O Hosts, R Sources, P stage, N notes, Y Play window and starters, D and E Night, X system, I interaction, J journeys).

Then every Break was checked against the browser or the code before it went in here. Six were artifacts of how I captured or captioned a state; they're corrected at the end, with what's real in each.

**Counts.** 392 findings across the fourteen reviews, 44 of them rated Break by the reviewer who found them; after checking and merging duplicates, 15 Breaks stand, below. Most of the rest collapse into twelve system changes, because the same problem showed up on every page.

## The short version

1. **On a phone, every page is wider than the screen.** The header's menu doesn't shrink, so each page measures 769–851px inside a 375px screen; the menu stops at "Grant a w," and Hosts, Sources, GitHub, and Present can't be reached. Eleven of fourteen reviewers found it. (B1)
2. **The site barely answers when touched.** No control has a pressed state; buttons, folds, and cards change in a single frame or not at all; copy buttons never say they copied; clickable cards don't lift. North Shore's motion language (quiet, 120–360ms, ease-out, a 1px press, a 2px card lift) isn't built. (X12, I2–I4)
3. **Messages land on the controls you need next.** The toast covers Run my changes and Start over in the Play window, the next remix line on a phone, and the wish preview. The next-step panel floats over the card that opened it, with no entrance. (B10, I1, I10)
4. **Several layouts break on a phone or a laptop.** Three levels' folds collapse to a 90px column and its script box to 0px; Hosts' run of show runs off the screen; the Meeting Timer overflows the Play window; opening one Remix menu at 1280 stretches three other cards and drops their buttons a thousand pixels. (B2, B3, B8, B15)
5. **Pages make you read before you can act.** The first starter is 3,000px down Starters on a phone; the wish builder starts below the fold during the event; "Present the stage" is 3,000px down Hosts; the first source is 3,190px down Sources. Long pages (Three levels at 11,000px, Hosts at 13,600px, Sources at 19,900px on a phone) have no in-page index. (S1, W4, O16, R6, L4, O5)
6. **Walls of text where steps belong.** Leads of 7–11 lines, cards of 14–22 lines, five steps typed inline in a paragraph, script step 5 at 18 lines with exact strings in the reading serif. The words can stay; the structure has to change: summary lines, lists, labeled rows, folds. (H6, O6, S4, L9, X8)
7. **The system has drifted.** 30–38 type styles per page; card titles six ways; about ten box styles with overlapping meanings; eight card paddings; five link looks; four disclosure looks; two secondary buttons. Number badges wear the primary button's fill, so they look pressable. (X3, X4, X9, X11, X13, X15)
8. **Copper is everywhere, so it points at nothing.** Every link at rest, callout bars, card top bars, and the focus ring all wear the one warm accent. North Shore's own rule is navy links that turn copper on hover. (X10, H16, Decision 3)
9. **The stage's first screen collides, and its presenter controls fail AA.** The "2:00:00" clock sits on top of a 9px explanatory line; the controls rest at 25% opacity (about 2.2:1) over the headings of two screens, with a key-hint line on top of them for six seconds after every load. (B5, B6)
10. **The speaker notes hide what the presenter needs.** At its own window size, Next and the timer fall below the fold on long notes; Call to order and Reset sit side by side at equal weight; and after a call to order on any day but the first run's, the part line says "time to move on" seconds in. (B11, B12, N6)
11. **Night mostly holds, with three holes.** The Happening now card turns into a bright cream slab; overlays share the fill of what's under them; placeholders (3.4:1) and native checkboxes keep light-theme grays. (D8, D7, E4, E19)
12. **The six starters each solve the same problems differently.** Disclosure has an icon in one and none in another; toggles show no on or off; the primary sits above results in one and below inputs in another. People learn by copying these files, so each pattern should be the one worth copying. (Y13, Y14, Y24)

What the reviewers found strong, and should stay, is listed under [Keep](#keep).

## Decisions for Sean

Each changes how several pages look or behave. A recommendation comes first in each.

1. **The phone menu.** (a) **Recommended:** a Menu button beside "First Builds" that opens the pages as full-width 48px rows, the current page marked, Present and GitHub grouped last. One 56px header row; nothing cut off. (b) Wrap the pills onto two rows (about 120px of header, everything visible). (c) Keep the sideways strip, contained, with the current page scrolled into view and the next item half-showing as the cue.
2. **Present and GitHub in the menu.** Both stay in every page's menu (decided October 9 and 11). Open: their emphasis. (a) **Recommended:** plain items after a thin divider, GitHub marked as leaving the site (↗); the Hosts page keeps its big "Present the stage" button. (b) Keep Present as the outlined pill, the loudest item in the header after the current page.
3. **Links at rest.** (a) **Recommended:** follow North Shore's own rule ("links shift navy → sun-800 with a copper underline" on hover): navy text with a quiet slate underline at rest, copper on hover and focus. Copper then marks the one thing per view: what's live, a caution, the focus ring. (b) Keep the copper underline at rest and take copper out of everything else instead.
4. **The starters' own colors on their cards.** (a) **Recommended:** keep each starter's hue (decided October 11) only in its icon tile; drop the 4px top bars, which read as a color code nobody explains (the rust one reads as an error). (b) Drop the hues. (c) Tie the hue to the level instead of the starter.
5. **After a copy, where the next step appears.** (a) **Recommended:** a docked sheet at the bottom of the window, full width on a phone, that rises in, never covers its trigger's row, keeps the three AI buttons with their hints, and closes on Done or Esc. Same for every copy meant for an AI (card, Play window, wish, jar). (b) Inline: the panel opens inside the card under its buttons and pushes the page down; each trigger needs its own spot.
6. **A wish from the jar.** (a) **Recommended:** pressing a wish fills the builder's three answers so the visitor sees and can change it, then copies with "Copy my wish." (b) Keep: pressing copies the full wish at once.
7. **One AI tool at a time.** The "where do I paste it" guidance appears four times on Grant a wish and on three pages in two orders. (a) **Recommended:** one shared block with "Gemini · Claude · ChatGPT" tabs that remembers the visitor's choice on their device (the site already remembers the pick in the next-step panel); one tool order everywhere. (b) Keep all three side by side, folded after the first page.
8. **Presenter-only controls on the shared stage.** (a) **Recommended:** one rule for every presenter-only control (the top-right buttons, Call to order, Pause and Reset, the timer buttons, the wait buttons): hidden when idle, shown at full strength when the mouse moves or a key is pressed; the room sees the clock and timer digits, never the buttons. (b) Hide the top-right controls only; keep the clock and timer buttons visible as part of the show.
9. **The stage clock's motion.** It glides 0.7s and opens 0.6s on frosted glass; North Shore asks for 120–360ms and no glass, and the glass was kept on purpose (October 11). (a) **Recommended:** keep the glass; shorten the glide and the open to about 360ms, animated with transforms so a Chromebook sharing to Meet doesn't drop frames. (b) Keep both as they are. (c) Follow the brand fully: 360ms and solid navy.
10. **An empty answer in the wish builder.** (a) **Recommended:** point at the field (a dark-copper border, a line under it, focus moved there), never a toast. (b) Treat the grey examples as defaults, so Copy always works.
11. **The starters in Night.** (a) **Recommended:** keep their own light look, set inside the Play window with an 8px inset and a hairline so it reads as a screen in a frame. (b) Teach them to follow the viewer's dark setting.
12. **The audit tools in the repo.** (a) **Recommended:** keep `scripts/design-audit/` and `docs/design-audit/` so the re-review after the fixes runs the same way. (b) Remove them after the design pass.

Flagged for content, outside this pass: the stage's title reads "A Friday Hackathon" on any day; Hosts numbers stage screens across the whole session inside each part ("7.", "9."); Starters' eyebrow names an event part, "The Remix Arcade," on an any-day page.

## Breaks, verified

| # | What breaks | Where | Checked how | Found by | Direction |
|---|---|---|---|---|---|
| B1 | On a phone the header's menu is 737px wide in a 375px screen and doesn't scroll; every page is 769–851px wide; Hosts, Sources, GitHub, and Present are out of reach, and on Hosts and Sources the current page is off-screen | Every page, 375px | In the browser pane at 375×812 (the menu's `ul` 769px wide, `scrollLeft` stays 0, document 770px); inventory on all six pages. Cause: in the phone header's column layout, `nav` keeps its content's width (`min-width: auto`), so the strip never becomes a scroller | X1, R1, S21, H14, O3, L20, W1, J25, D14, E2, I15 | `min-width: 0` on the header's children; then Decision 1 |
| B2 | Hosts' run of show runs off the right edge at 375: text cut mid-word, room pills and Show/Hide off-screen | Hosts, 375px | Inventory: Hosts 851px wide; CSS: `.message pre` is `pre-wrap` with no `overflow-wrap`, so the Google Slides addresses in two messages don't break | O1, E1 | `overflow-wrap: anywhere` on messages; `min-width: 0` on part cards |
| B3 | Opening a fold on Three levels at 375 pours each prompt into a 90px column (1,100–1,200px tall) and gives the script box 0px of width; the copy buttons cover "Read the script" and run off the card | Three levels, 375px | In the browser pane: both prompt bodies 90px wide, the script `pre` 0px wide. Cause: the fold sits inside a flex row (`.copybox`) beside its buttons | L1, L2, D1 | Fold header as a wrapping row; the open body spans the whole box beneath it |
| B4 | The stage's first screen draws the "2:00:00" clock on top of the small line that says what the page is; after Call to order it rides onto the subtitle | Stage, screen 1, 1280×720 | In the browser pane at 1280×720: the 9.35px note and the clock overlap | P1, J15 | Two-column title screen, clock in normal flow; the note off the canvas |
| B5 | The stage's presenter controls rest at 25% opacity (labels about 2.2:1, under AA), sit over the headings of screens 3 and 4, and a key-hint line covers them and the headings for six seconds after every load | Stage, every screen | CSS: `.controls { opacity: .25 }`; captures | P3, P10, J13, J14, J16, I18 | Decision 8; hints once per browser session, in the rail |
| B6 | Hovered link-styled buttons ("Start here," "The hosts' guide," "Present the stage"), the "First Builds" name, and the skip link turn copper text on navy: 2.2:1 in light, 1.6–1.8:1 in Night; Hosts' secondary link-buttons 4.49:1 in Night | Home, Hosts, every page's header | My contrast pass, hover forced. Cause: the global `a:hover { color }` wins over `.button` and `.brand` | (found in verification) | Give `.button`, `.brand`, and `.skip` their own hover colors |
| B7 | The Meeting Timer overflows the Play window at 375: it needs 353px in a 335px frame; card edges and the progress bar are cut | Play window, 375px; any narrow embed | In the browser pane at 335px: `scrollWidth` 353 | Y1, J4, D2, I6 | `min-width: 0` and fluid digits in the starter; the Play window as a full-width sheet on a phone |
| B8 | The Oracle's Sound button sits on the word "Lounge" in its title at 375 (in Play at once; standalone after an answer) | Oracle, 375px | Captures | Y20 | Sound in normal flow above the title |
| B9 | Toasts cover the controls just used: "Running your version." over Run my changes and Start over; on a phone, the remix toast over the next line's Copy; the wish toast over the preview | Play window, Starters, Grant a wish | Captures; CSS places the toast bottom-center, inside the dialog too | I1, Y2, S9, E3 | Inline status beside the buttons in dialogs; a toast never over its source |
| B10 | After Call to order on any day but the first run's, the notes' part line says "time to move on" seconds in, beside "1:59:55 left" | Speaker notes | My recapture; `notes.html` compares the wall clock to the first run's schedule (`segment.end`) instead of the time since the call to order | N24 | Measure the part from the called start |
| B11 | At its own 560×780 window, the notes push Next below the fold on long notes, and the timer's readout is cut in half on timed screens | Speaker notes | Captures (timed recapture) | N2, N3 | Status strip with the timer pinned under it; Back/Next in a sticky bar |
| B12 | Placeholders are 4.3:1 on the light fields and 3.4:1 in Night (the builder, the Sources search, the room calculator) | Grant a wish, Sources, Hosts | Reviewer sampling; CSS sets no `::placeholder` color | W9, E4 | A placeholder token: slate in light, navy-300 in Night |
| B13 | On a phone the stage's tall screens scroll inside the stage with no cue, and the corner clock pill and the rail cover their last lines; the address plate runs off the right edge on screen 4 | Stage, 375px | In the browser pane: the stage scrolls (815–891px of content in 748px); captures | P2 (downgraded from "can't scroll") | Clock pill into the rail; bottom padding; the address on one line |
| B14 | At 1280, opening one Remix menu stretches the other three Level 1 cards to its height and drops their Play and Copy buttons about 1,000px | Starters, 1280px | CSS: `.machines` stretches rows and `.actions` is pinned with `margin-top: auto`; capture | S2, D18, I16 | `align-items: start`; two columns per level, or the menu opens full width under its row |
| B15 | Native checkboxes and radios in Night keep the browser's grey (border 3.27:1), and unchecked radios look disabled | Hosts, Sources, Night | Reviewer sampling | E19 | `accent-color` and a 20px control in a 36px label row |

## The system pass: what fixes the most at once

Each change below is site-wide. Together they resolve most of the Friction and Polish findings, which is why the fix phase starts here.

**1. The frame.** B1's overflow fix and the phone menu (Decision 1); the current page's pill keeps one font weight so the menu stops shifting between pages (X21); "First Builds" at 18px/700 so the name anchors the bar. One footer template on every page: partner, Safe play, Site blocked at school?, an optional page note, then the signature (Sources drops Safe play today, X22). A guard against horizontal overflow on every page: `min-width: 0` on grid and flex children, `overflow-wrap: anywhere` on anything that can hold an address.

**2. Type: thirteen levels, one meaning each.** Display, h1, h2, h3, card title, h5 (sentence case, replacing 12px uppercase headings inside cards), eyebrow (only the page eyebrow and the partner label), lede, body, small, ui, ui-small, stat, mono (X4, X5; the full table is in `reviews/system.md`). Navy for anything a visitor must read; slate only for meta, section intros, and hints (X7). A lede is three lines at most (X8). Every page gets an eyebrow, so titles don't jump between pages (X17). Code, addresses, and names to type in Plex Mono chips that don't break mid-token (S6, L9, D12).

**3. Surfaces and spacing.** Six surfaces with one meaning each: page, band, card, note (context: summaries, routing, reference), copy well (text to copy, the only dashed border), caution (the one copper bar). Card links add a hover lift (X9). One spacing scale (4, 8, 12, 16, 24, 32, 48, 72, 96), one card padding per size, one section rhythm (72px), one grid gap (16px) (X16). Reading text capped at 68 characters a line (X6). Grids sized to their counts, so no orphan cells (X18).

**4. Components.** One primary and one secondary button in two sizes (44 and 32px), plus an option button for the wish jar (X11). Links in three looks: inline, action ("Label →"), and title (X15). Number badges become outlined circles, so they stop looking like buttons (X3, D6, H24). Tags and filter chips become pills (X23, R4). Tabs become one segmented control (X3). One disclosure, with a CSS chevron that turns (X13, S19). One input, with a hover border, an invalid state, and a readable placeholder (X14). One copy well whose button says "Copied" (W12, J28). One step card, one starter card, one page header, one section header.

**5. Interaction: the brand's motion, built.** From `reviews/interaction.md`'s spec: duration and easing tokens (120ms for color, 160–200ms for small things, 280ms for sheets and dialogs, 360ms at most); hover inside `@media (hover: hover)` so phones don't keep a stuck hover; a 1px press on everything pressable; cards that lift 2px; a "Copied" done state on every copy button, announced to screen readers; folds that ease open; outlines that never animate; and a reduced-motion version where nothing moves and color still shows state (I2–I5, I9, I16, X12).

**6. Overlays.** A toast never covers its source or the next control; inside a dialog, a status line sits beside the buttons instead (I1, Y2). The next-step panel per Decision 5, with an entrance, equal button heights, and a status line split from its question (I10, I11, S10, W18–W20). The Play window: on a phone a full-width sheet with Tool and Code tabs, Close top-right, Copy for my AI as the one filled button, and buttons that don't reshuffle when Show becomes Hide (Y3–Y5, I6–I8, J5). The copy-by-hand dialog hugs its content, says what to do on a touch screen, and offers Select all (S11, I17). Night gets an overlay surface one step above the card (D7).

**7. Lead with the job.** Starters opens with a level index and the first starter within two phone screens (S1, J3); the builder starts in the first screen of Grant a wish, the jar beside it (W4, W14); Hosts opens with the session's shape (2 hours, 57 minutes building, rooms of four, seven parts) and its two buttons (O16, J9); Sources' paths become compact rows (R6); Home's after hero has one button and the three steps beside it at 1280 (H3, J1). Long pages get an in-page index: a sticky level bar on Three levels (L4), "On this page" on Hosts (O5), a pinned filter bar on Sources (R6). Copy buttons move beside the step that names them (S3, L6).

**8. Walls into structure.** Summary line plus labeled rows (H6, O6), real lists for numbered steps (S4, D10), sub-steps for script step 5 with a separate "stop here if blocked" note (L9, S6), one shared "where do I paste it" block per Decision 7 (L10, S12, W13), and live-session-only material folded on ordinary days (W26, L16). The content pass's words stay; they move.

**9. Event day.** The part-changed notice joins the now bar instead of pushing the page down 74–182px (I14). The current part's section comes right under the Happening card, finished parts collapse to one line, dashed borders leave the schedule (H8, H9, J21). A now-bar link that points at the page you're on becomes a jump down the page ("Jump to the starters"), and on Hosts, "Go to this part" (S20, W3, O4, J23). Levels 2 and 3 get their own button in the Happening card (H7, J22).

**10. Night.** The Happening card stays dark with a copper rule (D8); one rule for reading text, cream or the lighter grey, not both side by side (E5); placeholder and checkbox tokens (B12, B15); badges outlined (D6); a hairline where a band runs into the footer (D16, E26).

**11. The stage.** Per `reviews/stage.md`: the title screen in two columns (B4); Decision 8 for every presenter-only control; headings anchored at one top line instead of centered, so they don't jump on each cut (P4); a 24px floor and weight 400 or more for audience text, which Meet's video compression otherwise smears (P8); one face per job (sentences in Newsreader, P9); a paused timer that looks paused and buttons that don't shift (P6); turn timers labeled per turn (P7); copper only on what's on now (P11); the not-started clock pill outlined, so filled means live (P13); a quiet two-press Reset (P14); one fixed layout for the open clock (P15); the address plate on the last screen (P20); a two-row rail on phones with the clock in it (P17, P18). Keep the instant cuts.

**12. The speaker notes.** Per `reviews/notes.md`: a compact header and a status strip (following the stage or not · screen n of 21 · the clock, labeled); the timer pinned under it with short "−1" and "+1" labels; Back and Next in a sticky bar that names where they go; each note's own "Say," "Do," and "Co-host" set as labeled rows; one clock control with a confirmed, undoable reset; the pace line measured from the call to order (B10); a two-column layout at 1280.

## Findings by surface

Severity is the reviewer's, adjusted where checking changed it. Items already covered by a system change name it and stop there. The full findings, with measurements and proposed fixes, are in the reviews.

### Home (`reviews/home.md`, with journeys and Night)

- **Friction.** The after hero: a nine-line lede, three near-equal buttons, the three steps below the fold at both widths, the right half empty at 1280 (H3, J1, D25, D26) → system 7. Hosts is reached four ways and Three levels four ways; "Everything here" repeats the menu as 1,270px of cards on a phone with an empty sixth cell at 1280 (H4); its five "Open" labels don't say where they go (H5, J27, D13). "Run it with your own team" is one 190-word paragraph with "what you give up" in the middle (H6, J8, D9). During: the Remix card has a button for level 1 only and no time left (H7, J22); the current part's section comes after the whole schedule (H8, J21); the notice shifts the page and repeats the bar (I14). Before: no primary button, and the one instruction to join is the quietest text (H10, D19); the checklist comes after the schedule, the four figures after both (H11). Schedule rows: too narrow on a phone, too wide at 1280 (H12, D27). Labels mix verbs, nouns, and destinations (H13). The close splits "one wonder, one worry, one word" into two cards and a line (H18).
- **Polish.** Past rows read as placeholders (H9, D15). One card-title style, one body color, one link weight (H19). "Show one person" stretches to its neighbor's height (H20). The now bar strands separators on a phone (H21, D28). "Next: What did we just do?, 13 min" (H22). Award tiles look like buttons (H23). The hero's hairline aligns to nothing (H27). The header name and the H1 repeat 140px apart on a phone (H26).

### Three levels (`reviews/levels.md`)

- **Break.** B3.
- **Friction.** The open script scrolls inside a 420px box beside the buttons with no sign it does on a Mac or phone (L3, downgraded from Break: it scrolls). 11,000px on a phone with no way to switch levels (L4). The chooser cards: tall, small link targets, repeated in each level's intro (L5). Each copy button sits away from the step that names it; no level has one primary (L6). "Copy for my AI" means two different things on two pages (L7). Each level has a different set of sections and three label styles (L8). Step 5 at 18 lines with exact strings in the serif (L9). The paste block: 1,300px of nested cards in muted text (L10). Space inside a card is larger than between cards on a phone (L11). An open prompt looks like the instructions around it (L14). Level 4 reads as a fourth level to try today (L15). During the event the sign-up panel is 10,000px down and the top says "nothing to sign up for" (L16). Two alternatives in the reverse order the text gives (L19).
- **Polish.** Copper on two callouts (L12); dashed borders mean two things (L13); a bold paragraph reads as the script box's caption (L18); list indents and card paddings differ (L21, L22); one underline spans two links (L23); the eyebrow repeats the title (L25); no copied state (L26).

### Starters (`reviews/starters.md`)

- **Break.** B14.
- **Friction.** The first starter is 3,015px down on a phone, 1,360px at 1280 (S1). The script cards put "Copy the script" 1,100–1,440px after the step that names it (S3). Level 2's five steps typed inline; Level 3's buttons explained in a 17-line paragraph (S4, S5). Script strings in the serif, wrapping mid-token (S6). The audience box has the strongest border on the page (S8, D32). Copy feedback away from the button; the phone toast three lines over content (S9). The next-step panel (S10). The copy-by-hand dialog half empty, with keyboard-only steps (S11). The paste guide: card in card, flat hierarchy (S12). Three disclosure looks (S19). The phone menu (S21).
- **Polish.** Four step cards for four sentences (S7). Titles at different heights and voids at 1280 (S13). Per-card hues (S14, Decision 4). A 70px icon tile and long uppercase audience lines per card (S15). The Remix summary competes with the title; bare blanks; nine buttons named "Copy" (S16, D33). Prose at 150 characters a line (S17). Levels barely read as sections on a phone (S18). The self-linking now bar (S20). The Group Maker's privacy note looks like description (S22, D35). Script buttons unequal widths (S23). Body text at 15px slate (S24).

### Grant a wish (`reviews/wish.md`)

- **Break.** B12 (placeholders).
- **Friction.** The empty builder shows bracket blanks as a finished wish under "ready to paste," with a toast for the error (W6, E3, I12, Decision 10). The third answer is a one-line box that cuts off the sentence (W8). The lede: 11 lines, an unlinked "Start here," a detour first (W4, J7). At 1280 the preview sits below the inputs with half the card empty (W5, E16). Three numbering systems; badges that look like buttons (W10). Six equal cards for one task and five tips (W11). The paste guidance four times in two orders (W13, Decision 7). The jar 1,330px below the builder; a press copies text never seen (W14, W15, Decision 6). Jar chips styled like text to copy, no record of the one taken (W16). The next-step panel (W18, W19, E15). Two copper bars side by side, while the real caution is plain text (W21, W27). "Ask for help" runs nine lines with a prompt to paste but no copy button (W22). Sections don't read as sections (W23). Live-session steps at full weight on ordinary days (W26).
- **Polish.** Two copy boxes built two ways (W12); chip widths ragged on a phone (W17); the panel's lead a bold serif sentence (W20); three reading sizes and two body colors (W24); prose at 150 characters (W25); keyboard shortcuts split across lines (W28); three link styles, and underlines broken by descenders (W29); card padding fixed at 16px (W31). The menu emphasis (W2) and the self-linking now bar (W3).

### Hosts (`reviews/hosts.md`)

- **Break.** B2.
- **Friction.** The empty link slots in Materials are italic lines among the buttons, off their baseline (O2, J11, E20; called a Break by its reviewer, it fails nothing but reads as broken). During the event the current part is 7,400px down on a phone and the now bar offers the participant's link (O4). No in-page index on a 13,600px page (O5, E8). Instructions as walls (O6, J10). The order of parts as a run-in sentence (O7). Part rows open from a small "Show" 900px from the title, and titles don't align (O8). Welcome open by default on other days (O9). Stage-screen lists numbered across the session with 21 copper-underlined titles, cues buried in 14px prose (O10). Message placeholders like "(your planner link)" look like message text (O11). Twenty buttons named "Copy," each on its own row (O12). Eight widths in use at 1280 (O15). The hero has no action; the session's figures are 3,000px down (O16, E9). "When it breaks" orphaned in a three-column grid (O17). Two disclosure styles, and the license line reads as the fold's contents (O18, E21). The presenter's keys in prose (O24). Checklist progress hidden (O25). Opening the stage and notes described three ways with no single button (J12).
- **Polish.** Message boxes crowded (O13). The invitation box detached from its bullet (O14). `?now=10:50` breaks across lines (O19). The two-ways cards unequal, no actions (O20). Bands without a meaning (O21). The room calculator's answer quieter than its question (O22). Two body link styles (O23). Small slate text to measure (O26). "The two slide decks above" points 3,000px up (O27).

### Sources (`reviews/sources.md`)

- **Friction.** The filter column scrolls on its own at 1280, but nothing shows it does on a Mac (R2, downgraded from Break: it scrolls). Topic tags wrap into a narrow column beside "What it says" on a third of the cards (R3, E11). Five chip-like styles for three jobs on every card (R4). "Copy a link to this entry" on its own row 45 times (R5). The first source 3,190px down on a phone; no way back to the filters (R6). The lede does six jobs in slate (R7). "The short version" a 17-line block (R8). Path cards don't look pressable (R9, E29). A chosen path looks like a focus ring and changes nothing in the first screen (R10, E14). The tabs stack ragged on a phone (R12, E22). "Search and filter" alone in a card, no open state, no "show results" (R13, E12). The count line doesn't name what's on (R14). With no results: two Clear buttons, the facets vanish (R15, E13, I24). Sections and groups look like siblings (R16). The page's synthesis comes last, its buttons unlabeled as to what they do (R17, E30). "What it says" has no open state (R26).
- **Polish.** Path grid 4 + 2 (R11). Copper on all 45 titles (R18, E6). The kind badge wanders (R19). Tag order varies (R20, E27). Notes at 95–100 characters (R21). Controls labeled in the serif; the search placeholder cut off (R22). The eyebrow repeats the title (R23). The now bar strands a separator (R24). The check date stated twice, already drifted (R25).

### The stage (`reviews/stage.md`)

- **Break.** B4, B5, B13.
- **Friction.** The rest is system 11: no fixed top line (P4); the 57:00 breakout timer on screens 13 and 14 against a 17-minute part (P5, needs a check: it is one timer shared across those screens, by design, which the label doesn't say); timer states (P6, P7); text for a Meet tile (P8); two faces for one job (P9); key hints (P10); copper on seven things on screen 4 (P11); two display lines competing (P12); the not-started clock looks running (P13); Reset beside Pause (P14); the open clock reflows when a wait starts (P15); part openers that don't name their part (P16); the phone rail drops the signature (P17); phone controls (P18); the plan table on a phone (P19); the last screen empty (P20).
- **Polish.** The glass reads as a gradient (P21); motion durations (P22, Decision 9); the counter unanchored (P23); number badges centered on the block (P24); award cards misaligned (P25); row 4 dimmed reads as disabled (P26); the code slide's point unmarked (P27); the address breaks at its hyphen (P28); the clock inset 12px from the content edge (P29).

### The speaker notes (`reviews/notes.md`)

- **Break.** B10, B11. The reset beside Call to order, which stays offered after the clock starts and would restart it, plus the timer's own Reset (N6).
- **Friction.** "No session running" reads as a lost connection; two countdowns in two styles (N5). The intro and links take the top of a small window on every screen (N4). Notes as one dense paragraph (N7). The next title separate from the Next button (N8). Help text describes keys for buttons already on screen (N9, N25). The 560 layout stretched at 1280 (N10). No way to jump to a screen (N15). No title or footer (N17). Timer buttons wrap on a phone (N22). Pause and Next both filled (N23).
- **Polish.** N11–N14, N16, N18–N21, N26, N27 in the review.

### The Play window and the six starters (`reviews/play.md`)

- **Break.** B7, B8, B9.
- **Friction.** The header: no primary, 152px on a phone, buttons that move when Show becomes Hide (Y3, Y4, I7). The code view on a phone: half a tool and five lines of code (Y5). A run that looks like nothing happened (Y6, I23). "Start over" beside "Run my changes," no undo (Y7). The timer's footnote tells you to close a window you may not be in (Y10). Timer controls: Previous and Next split by "+1 minute," widths that shift (Y11). Toggles with no on or off (Y13). The Group Maker's real button hidden below a weaker twin; its phone layout two screens long (Y14, Y15). The Feedback Builder's four-step scale wraps 3 + 1; its output off-screen on a phone (Y17, Y18). The Charter's commitment pills look like buttons (Y22). The Syllabus's rows open, with nothing to say so (Y24). A white flash before the starter paints (I8).
- **Polish.** Y8, Y9, Y12, Y16, Y19, Y21, Y23, Y25 in the review.

### Night (`reviews/night-a.md`, `reviews/night-b.md`)

- **Break.** B12, B15 (Night values).
- **Friction.** The bright Happening card (D8); overlays without elevation (D7, E15); cream fill doing three jobs (D6); reading text in two colors with no rule (E5); the raised surface doing seven jobs (E7); a band running into the footer (D16, E26). The rest are the light theme's findings, seen again in Night.

### Across the site (`reviews/system.md`, `reviews/interaction.md`, `reviews/journeys.md`)

Covered by the system pass. Two more from the journeys: a phone visitor is never told what they can do on a phone (J2), and the same process is numbered three ways on three pages (3, 4, and 5 steps) with three step-card styles and two tool orders (J26).

## Keep

What the reviewers named as working, and the fix phase must not lose:

- The cream, navy, and copper palette used with restraint in the heroes; the 1048px container with one hard left edge at every width; alternating cream and sand bands as the divider between sections.
- The focus ring on site pages: 2px, offset 3px, dark copper on light surfaces and light copper on navy, both above 3:1, consistent everywhere.
- The primary button: navy, 4px corners, 44px, Montserrat 600; one filled button per view where pages already have it ("Copy my wish," "Present the stage," Play).
- The base card (cream-50, hairline, 8px); Newsreader for reading and Montserrat for anything you press.
- The sticky now bar with its NOW pill; the navy Happening card as the loudest thing during the event; lengths, not clock times, in the schedule.
- Home's three-step "On your own? Start here"; the "Before you come" pattern of bold lead-ins.
- Every starter's "Monday:" line; Play, Copy for my AI, and Remix as the three verbs on every card; the Remix menu's three groups and its fill-in-the-blank lines.
- The script cards' structure: Before you start, Steps, You'll know it worked, If it breaks. Level 2's bolded menu names and code chip; the safety callout's bold lead-ins.
- The wish builder's live preview; the jar's voice; the keycaps; the "Keep it" band.
- The run of show: one card per part, with its stage, checklist, and messages; the "TO: MAIN CHAT" recipient line; the room calculator's plain answer; "When it breaks" as problem and fix.
- Each source's content model: title, provenance, kind, and one sentence on what it means for you; counts everywhere; the two-column browse at 1280.
- The next-step panel's idea: each AI with its one-line hint, at the moment of copying, waiting for Done.
- The copy-by-hand fallback that preselects the text.
- The stage: navy, cream type, one idea per screen, instant cuts between screens (right for Meet), the over-time state in copper with no alarm, the wait pill that follows the clock, the ladder repeated at the close, the address plate.
- The notes' large Back and Next, the "Next:" preview, the note set as the largest text.
- The desktop Play window's split, with the knobs first in the code; Run my changes inverting in Night.
- The Oracle's illustration and voice; the Charter's accordion with its plus and minus; the timer's big digits and "ends about" line; made-up data, labeled as made up, in every starter.
- Night's surface ladder (navy-900, navy-800, navy-700, navy-600), with text contrast of 7.9:1 to 14:1 everywhere except placeholders.

## Corrections to the reviews

Six Breaks came from how I captured or captioned a state, not from the site. What's real in each stays above.

- **The part-changed notice contradicting the page** (H1, J19, D3, I13). I triggered the notice with the next part while the clock still said the current one. On the day, the bar, the card, and the notice change together (`assets/site.js`, `update()`). Real: the notice repeats what the bar and the card already say, and pushes the page down 74–182px as it arrives (I14). The notice is on all six pages, not only Home (J20 is wrong).
- **The notes out of step with the stage** (N1, and N2's first version). My captions named the wrong screens. The notes follow the stage and show its timer; the reviewer revised against a correct capture, which is what's above.
- **The stage's timer shots** were first taken on a screen with no timer; retaken on screen 9 before the stage reviewer wrote.
- **The stage can't scroll on a phone** (P2). It scrolls inside the stage; my capture scrolled the window. Real: no cue, and the clock pill and rail cover the last lines (B13).
- **The filled wish builder still saying "Fill in all three answers first"** (W7, E3's second half). My capture pressed Copy empty, then filled the fields within the toast's seven seconds. Real, and small: the toast doesn't clear when the fields change.
- **The copy-by-hand dialog holding only a preview** (asked by S, D). The text was my short sample.

Three more claims from the measured inventory needed a real browser:

- **Present's hover hiding its label** (X2) and **links with no hover** (X12, I5). Links declare a 0.12s color change, and the inventory read them at once. The CSS turns Present's text navy on its cream hover, and links do turn copper. Real: the underline doesn't change, and no link has a pressed state. The fix phase checks both by hovering.
- **The focus ring at 2.92:1** (W30). The brief described the ring as North Shore's copper; the site uses one step darker (4.04:1 on cream, 3.6:1 on the sand band), chosen October 11 for this reason. No change.
- **The Sources filter column cut off** (R2) and **the script cut off** (L3). Both scroll on their own; the captures hid scrollbars, as macOS does. Real: nothing shows they scroll.

## Order of work

Once the decisions are made, in this order, each step committed on its own with a line in `docs/DECISIONS.md` for any decision, `node scripts/check-all.js` green, and each surface seen at 375 and 1280 in light and Night:

1. **The Breaks that are bugs** (B1–B3, B6, B7, B10, B12, B14, B15): small, isolated, verifiable, and worth having even if nothing else lands.
2. **The system** (system pass 1–6): tokens, type, surfaces, spacing, components, interaction, overlays, in `assets/site.css` and `assets/site.js`. Every page changes a little at once.
3. **Page by page**, in the content pass's order: Home, Three levels, Starters, Grant a wish, Sources, Hosts (system pass 7–9).
4. **The stage and the speaker notes** (system pass 11–12, B4, B5, B11, B13).
5. **The six starters** (B8, B9 in the Play window, the play review's findings).
6. **Night** across all of it (system pass 10).
7. **A cold re-review**: the same packets, rebuilt from fresh captures, read by fresh reviewers who see only the brief and the screenshots, until each surface comes back with no Breaks and no Friction its reviewer would block on.
