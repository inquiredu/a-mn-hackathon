# Interaction and motion · design review

Scope: hover, focus, pressed, selected, disabled, loading and done states; transitions; overlays (toast, next-step panel, Play window, copy-by-hand dialog, part-changed notice, stage clock); target sizes at 375px; keyboard focus. Phone screenshots are 2x, so pixel figures below are CSS px (device px ÷ 2).

A note on the inventory. States were forced in DevTools and read straight away. Every site link declares `transition: color 0.12s`, so a hover that only changes text color may have been read at t=0 and logged as "no change." Claims about `<button>`, `<summary>` and `<input>` (all `transition: none`) and about background, border, shadow and transform on links are reliable. Text-color hovers on links are marked **verify**.

## The five that matter most

1. **Most of the brand's interaction language isn't built.** No control on the site, the notes or the stage has a pressed state. Buttons snap with no transition. Inline links, disclosure summaries, the notes buttons and two hero buttons have no hover, and the hovers that do exist follow three different patterns. On a phone, where hover never fires, a tap shows nothing until its result arrives (I2, I3, I4).
2. **Toasts land on the controls you need next.** In the Play window, "Running your version." covers Run my changes and Start over for 7 seconds. On a phone, the Starters toast covers the next remix line's Copy button (I1).
3. **The Play window isn't designed for a phone.** At 375 the starter is cut off on the right. Pressing Show the code reshuffles the header buttons, and the code view leaves about 5 lines of code under a tool squeezed to 310px tall (I6, I7).
4. **On a phone the header hides four of its nine links.** The nav stops mid-word at "Grant a w" with nothing to show it scrolls. The inventory measures a horizontal overflow of about 770px on every site page at 375, so the header may widen the page itself (I15, verify).
5. **The stage's presenter controls fail AA when idle.** They rest at 25% opacity, about 2.2:1 for their labels, and stay that way on a touch device. Hide them when idle and show them at full strength on pointer movement or focus (I18).

## Findings

| ID | Sev | Where | What I see | Why it matters | Proposed fix |
|---|---|---|---|---|---|
| I1 | Break | play-timer-run-toast-375, play-charter-run-toast-375, play-timer-run-toast-1280, play-charter-run-toast-1280, starters-toast-375, wish-empty-copy-375 and -1280 | Toasts sit on top of the region the action came from. In the Play window at 375, "Running your version." (≈104–271 × 698–772) covers the middle of Run my changes and the left half of Start over (buttons at y 736–780). At 1280 it covers two-thirds of Run my changes and straddles the line between the panes. On Starters at 375 the toast is only ≈186px wide, wraps to three lines, and covers the next remix line and the top of its Copy button, 21px above the bottom edge. On the wish builder it covers the preview. It stays 7s, and pausing on hover does nothing on touch. | Start over is the recovery action right after a run goes blank. Someone copying three remix lines in a row has to wait or work around the toast. | Rule: a message never covers its source or the next likely control. **Play window:** drop the toast and add an inline status line beside the buttons (role=status, Montserrat 14px, secondary ink): "Running your version", fading out after 3s. **Site toast:** max-width min(420px, 100vw − 32px), at most two lines, bottom calc(16px + env(safe-area-inset-bottom)); duration 3s + 50ms per character, capped at 6s; tap or Esc dismisses; pause on hover and focus-within. **Validation** never goes in a toast (see I12). |
| I2 | Friction | inventory, every page: "active: no change" on all buttons, links, summaries, cards, inputs; notes and stage too | No pressed state anywhere. | Pressing gets no acknowledgment. On touch there is no hover either, so a tap on Play shows nothing until the frame paints 170–350ms later. The brand asks for a 1px press nudge. | `:active` on everything pressable: `transform: translateY(1px)` (80ms in, 120ms out), plus a fill one step past hover for filled buttons (light primary: rgb(20,36,52); secondary: rgb(220,213,199); Night secondary: rgb(69,98,125)). Cards drop from their −2px lift back to 0. |
| I3 | Friction | inventory hover rows; starters-remix-open-1280 (Remix menu); home hero ("Try a starter", "Run it with your team"); notes.html; wish jar; sources tag chips; home also-cards | Hover is missing or off-pattern. **None:** every `<summary>` except the Hosts segment heads (Remix menu, Read the prompt and Read the script, How the first run went, What Google Sites does to pasted code); all four notes buttons; Home's two transparent outline buttons, while the same component on Hosts gets a sand fill. **Weak:** wish-jar buttons change only the border color. **Inconsistent:** tag chips swap hue on hover in light (teal tint to sand) but only change the border in Night. **No lift:** Home also-cards change the border color only, with no 2px lift or shadow; Sources path cards fill sand but don't lift either. | A pointer user can't tell which of two identical-looking rows is a control: a summary looks like a heading until it's clicked. Three hover patterns for one idea ("this is pressable") reads as unintended. | One hover rule per control type (spec below). Gate every hover in `@media (hover: hover)` so phones don't keep a stuck hover after a tap. Summaries get a teal-tint ghost fill, as the Hosts segment heads already have. Home's transparent outline buttons join the secondary style (cream fill, sand on hover). Chips step one tint darker in both themes. Card links lift 2px with a light shadow. |
| I4 | Polish | inventory "transition: none" on every `<button>`, `<summary>`, `<input>`; motion-notes: "hover and focus changes are instant" | Fills and borders change in a single frame. The only declared site transitions are a 120ms link color (often inert, see I5) and the toast. | The brand's motion is "quiet, 120–360ms, ease-out." Snapping fills look abrupt next to the toast's soft entrance and the stage's eased clock. | Base rule on every pressable: `transition: background-color, border-color, color 120ms var(--ease-out), box-shadow, transform 160ms var(--ease-out)`. Outlines get no transition: the focus ring appears at once. |
| I5 | Friction (verify) | inventory: all inline links (Newsreader underline links, footer `a.inline`), `a.present-link`, `a.button` | Links show no hover change, but each declares a 0.12s color transition, so a color hover may exist and was read before it began. Two consequences to check in a real browser: (a) whether inline links move to copper as the brand specifies; (b) whether the Present pill, which turns its background cream rgb(244,241,235) on hover, also turns its text navy. If its text stays cream, the label disappears at 1:1 on every page, in both themes. | (a) is the brand's link rule. (b) would make the button for the stage blank under the pointer. | Verify both with a hover in Chrome after 200ms. Spec: inline link hover = dark-copper text (#8A522C light, rgb(208,148,102) Night) and a 2px underline. Present hover = cream fill with navy rgb(20,36,52) text, both changing together. |
| I6 | Break | play-timer-375, play-timer-code-375 | Play window at 375: the starter is cut off on the right (the "Now · Celebrations" card and the Agenda card run past the frame edge). In code view the tool shrinks to ≈310px tall and the code box to ≈131px (about 5 lines), under a 4-line help paragraph. That's two small scroll areas stacked inside a dialog. | A phone visitor can't see the whole tool. Editing code in a 5-line window under a cropped preview is the hardest version of this task. | Below 768px, turn the dialog body into two tabs, **Tool** and **Code** (a segmented control under the title, 44px tall, selected tab navy fill), with one pane at a time at full height. Run my changes switches to Tool and shows the result. Make sure the frame is the full dialog width and the starter has no min-width wider than 320px (cross-check with the Play and starters reviews). |
| I7 | Friction | play-timer-375 vs play-timer-code-375; play-timer-1280; play-open (starter footer text) | **Header:** Show the code, Copy for my AI and Close are three equal outline buttons, so nothing says what the next step is. **Reflow:** at 375 the buttons wrap onto two rows, and the Show→Hide relabel changes the wrap. Copy for my AI jumps from row 2 left to row 1 right, and Close moves from row 2 right to row 2 left. The header is ≈152px tall before the tool begins. **Conflicting path:** the starter's own footer says "close this window and press Copy for my AI" while the header has that button. | Buttons that move after a press break spatial memory: the next tap lands on the wrong control. Equal weights hide the intended path (Play → Copy for my AI). | Title row: title on the left, **Close** as a quiet 44×44 control pinned top right (text "Close", or a CSS-drawn ×, with an aria-label). Action row: **Copy for my AI** as primary (navy), **Show the code** as a toggle with `aria-pressed` and a fixed `min-width: 10em` so the relabel can't reflow (or use the I6 tabs and drop the toggle on phones). Header at 375 ≤ 104px. Starters running inside Play should hide their "close this window" line (the frame can pass `?inplay=1` or a postMessage). |
| I8 | Friction | play-open (+60ms frame) | The dialog appears in one frame with a blank **white** rectangle where the tool goes (white, not cream). The starter paints 170–350ms later. Closing is instant. | A blank white box reads as "broken" for a beat, especially on a slow Chromebook where load takes longer than 350ms. | Frame placeholder: cream rgb(250,248,244) with a centered Montserrat 14px line "Starting The Meeting Timer…". The frame starts at `opacity:0` and fades in over 160ms on `load`. Dialog enter and leave as in the overlay spec below. |
| I9 | Friction | starters-toast-1280, starters-toast-375, starters-remix-open-375 | Copy buttons don't confirm where you pressed. The only feedback is the toast, ≈480px away at 1280 (button at ≈308,406; toast at ≈640,756). The button never shows that it worked. | People watch the thing they pressed. With eight starters and 48 remix lines, "which one did I copy?" is a real question. | On success the button turns into **"Copied"** for 2s: teal-tint fill, navy border, `min-width` locked so the row doesn't shift, and an announcement in a polite live region. Remix lines then need no toast: put the instruction "Each line goes into the same AI chat" once, as a static line at the top of the Remix menu. On failure, the copy-by-hand dialog opens. |
| I10 | Friction | starters-next-step-375, starters-next-step-1280, wish-jar-next-step-375, wish-jar-next-step-1280, next-step strip | Next-step panel: appears in one frame (+71ms) with no entrance. At 375 it takes ≈417 of 812px (51%) and floats 13px in from the edges, covering the button that opened it. Its 1px navy border reads heavier than any other overlay. The heading fuses three messages in bold serif: confirmation, instruction and question. Focus handling is unknown (inferred). | A half-screen panel that appears without motion feels like a page error. With the trigger covered, nothing links cause and effect. A three-part bold sentence won't be read at a glance. | Dock it as a bottom sheet: full width at <768px (no float, top corners 14px), max-height 60dvh with internal scroll. Enter: opacity 0→1 and translateY(24px)→0 over 280ms ease-out; leave in 200ms ease-in. Hairline border rgb(220,213,199) plus the overlay shadow, not navy. Heading split: a status line in Montserrat 13px uppercase eyebrow, "Copied · The Meeting Timer", then a Newsreader line, "Paste it into your AI chat. Not open yet?". On open, move focus to the heading (tabindex −1); Esc and Done close it and return focus to the trigger. Keep: it doesn't close by itself. |
| I11 | Polish | starters-next-step-1280, wish-jar-next-step-1280 | In the next-step panel, "Open Claude" is ≈44px tall while "Open Gemini" and "Open ChatGPT" are ≈55px. Their tops line up and their bottoms don't. | Three equal choices that render unequal look accidental. | Put the three choices in a grid with the button in row 1 and the note in row 2 (`grid-template-rows: auto auto`, `align-items: start`), every button `min-height: 48px`. |
| I12 | Friction | wish-empty-copy-375, wish-empty-copy-1280 | Pressing Copy my wish with empty answers shows only a toast. The fields get no error state, focus doesn't move, and the grey placeholders ("a countdown timer", "my fourth graders") read like filled-in answers. | Someone who reads the placeholders as defaults gets an error they can't trace to a field, and the message vanishes after 7s. | Either (a) treat the placeholders as defaults, so an empty field uses its example and Copy my wish always works (fewest steps), or (b) show inline errors: a 2px dark-copper border on each empty field, a Montserrat 14px dark-copper line under it ("Say what it is"), `aria-invalid`, and focus on the first empty field. Never a toast. Owner's call (see Questions). |
| I13 | Break (verify) | home-cue-375, home-cue-1280 | Three regions disagree about what's on now. The cue says "Now: Grant a wish." The now bar directly above it still says "NOW The Remix Arcade · Next: Grant a wish." The hero below still says "Happening now · The Remix Arcade." | On the day, a participant can't tell which part is running, and this is the one screen meant to tell them. | When the clock changes part, the now bar and hero update in the same frame (one source, one render), and the notice only announces the change. If keeping the hero still under a reader is deliberate, the now bar must still update, and the hero gets a small "Earlier: The Remix Arcade" eyebrow until the person presses Take me there. Verify this isn't just how the screenshot was captured. |
| I14 | Friction | cue strip; home-cue-375, home-cue-1280 | The notice appears in one frame and pushes everything below it down: 74px at 1280, 182px at 375. The hero's Open the starters button jumps as it arrives. | An unrequested layout shift while someone reads or reaches for a button is how mis-taps happen. | Fold the notice into the now bar instead of adding a band: the now bar's text crossfades to the new part (200ms), and a 2px copper rule draws along its bottom edge (scaleX 0→1, 360ms) for 6s. Take me there and Got it sit in the bar, which is `position: sticky` so nothing below moves. If it stays a band, reveal it with `grid-template-rows: 0fr→1fr` over 240ms ease-out, and give it `role="status"`. |
| I15 | Break (verify) | home-cue-375 (header); inventory "At 375px: horizontal overflow" ≈770px on index, levels, starters, wish, sources and 851px on hosts; `a.brand` measures 738px wide | At 375 the nav row stops mid-word at "Grant a w". Hosts, Sources, GitHub and Present are off-screen, with nothing to say the row scrolls. A 738px brand link suggests the whole header row, not just the nav, is wider than the viewport, which would let the page scroll sideways. | Four destinations are invisible on the device many visitors use. If the page scrolls sideways, every page feels broken on a phone. | First make overflow zero: the header grid columns use `minmax(0,1fr)`, and the nav gets `min-width:0; overflow-x:auto`. Then pick one: (a) keep the scroll strip, scroll the current page's pill into view on load (`scrollIntoView({inline:'center'})`), add 16px end padding and `scroll-snap-type: x proximity` so items stop on word boundaries; or (b) at <600px, a "Menu" button (44px) opens a full-width sheet of the 7 links as 48px rows, with Present as its own button beside Menu. I'd pick (b): every destination one tap away and nothing cut off. |
| I16 | Friction | starters-remix-open-1280, starters-remix-open-375, remix-open strip | Remix menu: a native ▼ marker, no hover, opens in one frame. At 1280 the card is ≈212px wide inside, so each remix line wraps at ≈120px to as many as 7 lines. The open fold makes its card ≈1,500px tall and stretches its three neighbors into empty columns. | Opening one card changes the whole row: three cards become tall empty boxes. Seven-line remix rows are hard to scan. | `align-items: start` on the starter grid so siblings don't stretch. At ≥1024px, open the Remix menu as a full-width row under its card row (`grid-column: 1 / -1`) with the remix lines in two columns. Custom chevron that rotates 0→90° over 160ms; the fold's content fades in with a 4px slide over 200ms (spec below); summary `min-height: 44px` with a teal-tint ghost fill on hover. |
| I17 | Friction | fallback-dialog-375, fallback-dialog-1280 | Copy-by-hand dialog: fixed at nearly full viewport height (788px at 375, 776px at 1280) whatever its content, leaving ≈305–313px empty under Done. The phone version gives keyboard-only instructions (Ctrl+A, ⌘A). The only action is Done. | Half a screen of empty space looks unfinished. A phone user has no Ctrl+A, and the job is to copy, not to finish. | `height:auto; max-height: calc(100dvh − 32px)`, with the textarea `rows=10` and internal scroll. Primary button **Select all** (programmatic `select()` works even when the clipboard API is blocked), then a secondary Done. Keep the preselected text. Enter and leave as dialogs (spec). |
| I18 | Break | motion-notes (stage: controls at 25%, fade to full on hover over 0.2s); inventory present.html controls (cream on rgb(20,36,52), 1px rgb(157,174,188) border) | At rest, the presenter controls' labels are cream at 25% opacity over the navy stage, about **2.2:1** (computed from the blended colors), against an AA minimum of 4.5:1. A touch device never hovers, so they stay at 25%. | It's an AA failure, and the controls look disabled. The dimming exists so the audience isn't distracted, which hiding achieves better. | Idle-hide: full opacity on pointer move, touch or `:focus-within`; fade to `opacity:0` (with `visibility:hidden` after the fade) 2.5s after the last movement; fade in 120ms, out 200ms. With `(pointer: coarse)`, show them on tap and hide 4s later. Keyboard shortcuts remain. The key-hint line can say "Move the mouse for controls." |
| I19 | Friction | motion-notes (session clock); inventory present.html (`section.session-clock` transitions 10 properties at 0.7s) | The clock glides 0.7s, grows 0.6s and shrinks 0.55s; the backdrop takes 0.5s; the wait pill rises with a slight scale over 0.5s. It animates `right`, `bottom`, `font-size`, `padding`, `gap` and `border-radius`, which forces layout every frame, and fades in a frosted-glass layer. | All of these are over the brand's 120–360ms, and the last 10% of the glide creeps for 0.3s. Layout-driven animation plus a backdrop blur on a Chromebook that's also encoding a Meet share is where frames drop, and the audience sees the judder. | FLIP with transform: measure the corner and centered boxes, animate `transform: translate() scale()` and opacity only, 360ms `var(--ease-move)`, then swap to final layout. Backdrop opacity 240ms. Replace the frosted glass with solid navy rgb(20,36,52) at 96% plus the overlay shadow (hairlines before shadows, no textures). Wait pill: opacity and translateY(6px)→0 over 240ms, no scale. |
| I20 | Polish | inventory present.html focus-visible | The stage's focus ring is 3px Water teal rgb(139,174,186), not the specified 2px copper with a 3px offset. The stage controls show no hover of their own (verify: they declare a 0.25s transition, so the measurement may have missed it). | A second focus language on the one surface the presenter drives by keyboard. | 2px rgb(208,148,102) ring, offset 3px, as on the site's navy header. Per-button hover: fill rgb(46,75,102), border cream. Pressed: 1px nudge. |
| I21 | Friction | inventory notes.html | Speaker notes: no hover and no pressed state on any of the four buttons. "Reset the session clock" has exactly the style and size of "Call to order now" and sits directly beside it, both full-width outline buttons 40px tall. The header links (Open the site, Hosts, The stage) are 22px tall at 375. | A presenter clicking fast beside a live call can reset the session clock by accident, with no visible difference between the two buttons and no confirmation (inferred). | Call to order now stays prominent. Reset becomes a quiet text button below a hairline divider, asking "Reset the clock? [Reset] [Keep it]" inline before it acts. All buttons get the secondary and primary hover and pressed specs. Header links get `line-height: 1.6` or 2px vertical padding to reach 24px. |
| I22 | Friction (AA verify) | inventory hosts 375 (27 checkboxes 18×18 "under 24"), sources 375 (18 filter checkboxes 18×18; 13 single-line source title links 20px tall), notes 375 (3 links 22px) | Checkboxes are 18px native controls with `cursor: default` and no row hover. Single-line source titles are 20px tall. | WCAG 2.2's 24px minimum: the checkboxes pass only if their `<label>` wraps them and serves as the hit area. Hosts checklists get ticked on the day, often on a laptop trackpad. | Checkboxes: `width/height: 20px; accent-color: rgb(32,56,79)` inside a label row with `min-height: 36px`, `cursor: pointer` and a teal-tint ghost fill on hover. Checked: the label shifts to secondary ink over 120ms (no strikethrough, so it stays readable). Source title links: `line-height: 1.45` (≥24px). |
| I23 | Friction | play-timer-code-375, play-timer-code-1280; help text above the code | Run my changes gives no sign that the tool reloaded beyond the (covering) toast. When an edit breaks the code, the frame just goes blank, and the help text warns ahead of time ("Gone blank?"). Start over appears to throw away every edit at once with no undo (inferred). | A failure the tool can see should be shown, not guessed at. Losing ten minutes of edits to one press is the worst outcome for a beginner. | **Running:** the frame dims to 40% opacity for the reload, then fades back in on `load` (160ms), with the inline status from I1. **Error:** inject a small `window.onerror` reporter into the `srcdoc` that posts the message and line to the parent, and show a dark-copper notice in the code pane: "Something on line 42 stopped it running. Undo (Ctrl+Z) or Start over." **Start over:** acts at once, then offers "Back to the original. **Undo**" inline for 8s (keep the edited text in memory). |
| I24 | Friction | sources-no-results-375, sources-no-results-1280 | Two "Clear filters" buttons show at once (toolbar and empty-state card). The label says filters when the cause here is a search word. "Open every summary" stays active with 0 results. The facet list shrinks to "Anything 0" and every other option disappears, so the panel jumps. | Two identical buttons ask "which one?". A label that doesn't name the cause makes people hunt. Vanishing options make the filter panel feel unstable. | One recovery button, in the empty-state card, labeled by cause: "Clear the search" (search only), "Clear filters" (filters only), or "Show all 45" (both). Hide the toolbar copy while the empty card shows. Disable "Open every summary" at 0 results (disabled spec below). Keep zero-count facet options in place, disabled, with their "0". |
| I25 | Polish | play-timer-code-1280 ("Hide the code"); wish-jar-next-step-1280; inventory sources `button.src-toggle` | Toggles and choices have no visual "on" state. Show the code changes only its label. A pressed jar wish leaves no mark once the panel closes. "What it says" toggles have no expanded indicator (inferred). | A state that only exists in a label is easy to miss, and nothing records what you've already used. | Toggles get `aria-pressed` or `aria-expanded` and the selected look (navy fill, cream text, as the Sources tabs already use) or a rotating chevron for show and hide. A copied jar wish keeps a 2px navy left rule and a small "Copied" tag for the rest of the visit. |
| I26 | Polish | anchor-jump (+473ms onward) | Start here scrolls smoothly (about 450ms, native) and lands with the section's copper double rule flush against the top of the viewport, heading ≈25px below. | The arrival looks clipped. | `scroll-margin-top: 32px` on in-page targets. Keep the native smooth scroll and its reduced-motion fallback. |

## Region by region

- **Header nav (all pages):** the hover ghost fill (rgba(255,255,255,.12)) and the cream "current" pill are right and clear. At 375 the row is cut off and may cause page overflow (I15). Present's hover needs checking (I5). No pressed state (I2).
- **Buttons (primary and secondary `<button>`):** the hovers follow the brand (primary one step darker, secondary sand fill with a navy border) but snap (I4) and never press (I2). Home's transparent outline buttons have no hover at all (I3). No disabled style exists anywhere (I24, spec).
- **Small buttons (remix Copy, Sources "What it says" and copy-link):** 32px tall, which clears 24px and is comfortable. The done state is missing (I9), and so is the toggle state (I25).
- **Chips (wish jar, tag chips):** the jar's hover is border-only, and the tag chips use different hovers in light and Night (I3). No chosen state on the jar (I25).
- **Text links:** copper underline at rest (seen on Grant a wish). The hover is unconfirmed (I5).
- **Cards (Home also-cards, Sources path cards):** no lift (I3). The whole card is the target, which is good.
- **Disclosures (`<summary>`):** native markers, no hover, instant (I3, I16). The Hosts segment heads have the right hover; copy it.
- **Inputs:** focus ring present. No hover border, and no invalid state anywhere (I12).
- **Checkboxes:** 18px, default cursor (I22).
- **Copy flow (button → message → next step):** the steps exist, but the feedback sits in the wrong place: the toast is far from the button or on top of it (I1, I9). The panel arrives with no motion and covers its trigger (I10, I11).
- **Play window:** native modal, Esc presumably works. Instant open over a white flash (I8); not phone-ready (I6, I7); runs give no evidence and fail silently (I23); its toast covers its controls (I1).
- **Copy-by-hand dialog:** right idea, text preselected. Too tall, and keyboard-only on a phone (I17).
- **Wish builder:** validation by toast (I12).
- **Home part-changed notice:** contradicts the bar above it (I13) and shifts the page (I14).
- **Sources finder and empty state:** a clear message and a way out. Duplicated, mislabeled recovery button and vanishing facets (I24). Title links under 24px at 375 (I22).
- **Speaker notes:** no states at all. Reset sits too close to Start (I21).
- **Stage controls:** too dim at rest, an AA failure (I18). Off-spec focus ring (I20).
- **Stage clock:** eased well (no bounce) but long, layout-driven and frosted (I19).
- **Stage screens:** instant cuts. Keep (see below).
- **In-page jumps:** smooth and short. Arrival a little tight (I26).
- **Focus ring (site):** consistent everywhere: 2px, offset 3px, dark copper rgb(169,101,58) on light surfaces (≈4.0:1 on cream) and light copper rgb(208,148,102) on navy (≈4.7:1). Good.

## Keep

- The site focus ring: one spec on every control, with dark and light copper chosen per surface, both above 3:1.
- The `<button>` hover pattern: primary one step darker, secondary sand ghost fill with a navy border. Extend it rather than replace it.
- The header nav's ghost-fill hover and cream current-page pill; the Hosts segment heads' teal hover.
- The toast's entrance (fade and rise over 200ms, pause on hover). The motion is right; its placement and duration are what need work.
- The next-step panel waiting for Done instead of closing itself: people need it while they switch tabs.
- A copy-by-hand fallback that preselects the text, so a locked-down district laptop still gets the code.
- Sources' empty state: a plain sentence and one way out.
- Instant cuts between stage screens. Meet's screen share compresses crossfades into mush, and a cut reads cleanly in a participant's small video tile. The controls' 0.2s fade and the key-hint line fading after 6s are both quiet and right.
- Native smooth scrolling for in-page links, instant under reduced motion.
- Target sizes on most site controls (36–44px), well above 24px.

## Questions for the owner

- Wish builder: when an answer is empty, should Copy my wish use the placeholder example (always works, fewest steps) or stop and point at the field (I12)?
- Home: is the hero meant to stay on the old part until Take me there? If it is, the now bar should still update (I13).
- Play window: should code edits survive closing and reopening the window, at least until the page reloads (I23)?
- Stage: are controls that hide when idle acceptable to the presenter, given the keyboard shortcuts (I18)?
- Please verify one path I can't see: pressing Copy for my AI inside the Play window. The next-step panel has to appear above the modal (inside the dialog or the top layer), not underneath its backdrop.

## A proposed interaction spec

Plain CSS and JS, no libraries. Colors are values the site already uses.

### Tokens

```css
:root {
  --dur-1: 120ms;   /* color, fill, border: hover, focus, press release */
  --dur-2: 200ms;   /* small things appearing: toast, fold content, status line */
  --dur-3: 280ms;   /* sheets and dialogs entering */
  --dur-4: 360ms;   /* the largest spatial move: stage clock */
  --dur-exit: 160ms;/* leaving is ~25% faster than arriving */
  --dur-press: 80ms;

  --ease-out:  cubic-bezier(.2,.7,.2,1);   /* already on site links: the default */
  --ease-in:   cubic-bezier(.4,0,1,1);     /* exits only */
  --ease-move: cubic-bezier(.22,1,.36,1);  /* already on the stage clock: spatial moves only */

  --lift: translateY(-2px);
  --press: translateY(1px);
  --shadow-lift: 0 6px 18px rgba(20,36,52,.10);
  --shadow-overlay: 0 12px 40px rgba(20,36,52,.16); /* already in use */
}
```

Rules: no bounce or overshoot curves; nothing longer than 360ms; outlines never transition; hovers live inside `@media (hover: hover)`.

### States by control type

Light values first, Night after the slash where they differ. "Ring" = 2px copper outline, offset 3px (rgb(169,101,58) on light surfaces, rgb(208,148,102) on navy).

| Control | Default | Hover | Focus-visible | Pressed | Selected / on | Disabled | Busy | Done |
|---|---|---|---|---|---|---|---|---|
| Primary button | navy rgb(32,56,79) fill, cream text / cream fill, navy text | fill rgb(26,46,65) / rgb(234,229,219) | ring | fill rgb(20,36,52) / rgb(220,213,199), `--press` | n/a | fill rgb(234,229,219), text rgb(110,133,153), no hover, `cursor:not-allowed` / fill rgb(46,75,102), text rgb(157,174,188) | label becomes the action in progress ("Running…"), `aria-busy`, shown at least 300ms so it never flickers | label "Copied" (or the result) for 2s, then reverts over 200ms |
| Secondary button (incl. Home's transparent ones) | cream rgb(250,248,244) fill, slate rgb(110,133,153) border / navy fill, rgb(157,174,188) border | sand rgb(234,229,219) fill, navy border / rgb(46,75,102) fill, cream border | ring | rgb(220,213,199) / rgb(69,98,125), `--press` | `aria-pressed="true"`: navy fill, cream text (as the Sources tabs) | transparent fill, rgb(220,213,199) border, slate text | as primary | "Copied": teal-tint rgb(227,237,240) fill, navy border, 2s, `min-width` locked |
| Small button (Copy, What it says, copy link) | as secondary at 32px | as secondary | ring | as secondary | toggles: chevron rotates 90° and `aria-expanded` | as secondary | n/a | as secondary |
| Chip (wish jar, tag chip) | teal-tint fill, slate border / rgb(46,75,102) fill | next Water tint step and navy border, the **same** in both themes | ring | `--press` | active filter: navy fill, cream text. Copied wish: 2px navy left rule and a "Copied" tag for the visit | n/a | n/a | n/a |
| Text link | navy text, 1px copper underline, offset 3px | text #8A522C / rgb(208,148,102), underline 2px | ring | n/a | n/a | n/a | n/a | n/a |
| Header nav pill | cream text on navy | ghost fill rgba(255,255,255,.12) | ring (light copper) | ghost .20, `--press` | current page: cream fill, navy text, no hover | n/a | n/a | n/a |
| Present pill | 1px cream outline | cream fill **and** navy text together | ring | `--press` | n/a | n/a | n/a | n/a |
| Card link | cream fill, hairline rgb(220,213,199) | `--lift`, `--shadow-lift`, border rgb(110,133,153); its "Open" cue turns dark copper | ring on the card | back to 0, no shadow | n/a | n/a | n/a | n/a |
| Disclosure summary | CSS chevron, Montserrat 600, `min-height:44px` | teal-tint ghost fill (−8px inline margin keeps the text aligned) | ring | `--press` | open: chevron at 90° | n/a | n/a | n/a |
| Tab | as secondary | as secondary | ring; arrow keys move between tabs | `--press` | navy fill, cream text, no hover | as secondary | n/a | n/a |
| Input, textarea | cream fill, slate border | navy border | ring and navy border | n/a | n/a | sand fill | n/a | n/a |
| Input, invalid | 2px #8A522C border and a Montserrat 14px #8A522C message underneath, `aria-invalid`, `aria-describedby` | | | | | | | |
| Checkbox, radio row | 20px control, `accent-color` navy, label row ≥36px | row teal-tint ghost fill, `cursor:pointer` | ring on the control | n/a | checked: label secondary ink rgb(69,98,125) | control and label slate | n/a | n/a |
| Stage control | hidden when idle (see Overlays); rgb(20,36,52) fill, rgb(157,174,188) border | rgb(46,75,102) fill, cream border | ring (light copper) | `--press` | n/a | n/a | n/a | n/a |

### Transitions by kind of change

| Change | Properties | Duration | Easing |
|---|---|---|---|
| Hover and release on any control | background-color, border-color, color | `--dur-1` (120ms) | `--ease-out` |
| Focus ring | outline (no transition: appears at once) | 0 | n/a |
| Press | transform `--press`, fill one step | in `--dur-press` (80ms), out `--dur-1` | `--ease-out` |
| Card lift | transform, box-shadow, border-color | 160ms | `--ease-out` |
| Done label swap (Copy → Copied) | text swaps instantly; fill and border 120ms; revert after 2000ms | 120ms, revert 200ms | `--ease-out` |
| Disclosure open | chevron rotate 0→90°; content opacity 0→1, translateY(−4px)→0 | 160ms; 200ms | `--ease-out` |
| Disclosure close | instant (native), or 120ms opacity if JS-managed | 0–120ms | `--ease-in` |
| Inline status line | opacity in; out after 3s | 120ms in, 200ms out | out / in |
| Frame reload (Play) | iframe opacity 1→.4 on Run, →1 on `load` | 120ms, 160ms | `--ease-out` |
| Now bar part change | text crossfade; a 2px copper rule scaleX 0→1, removed after 6s with opacity | 200ms; 360ms; 200ms | `--ease-out` |
| In-page jump | native `scroll-behavior: smooth`, `scroll-margin-top: 32px` | browser | browser |
| Stage clock glide, grow, shrink | transform (FLIP translate and scale), opacity | `--dur-4` (360ms) | `--ease-move` |
| Stage backdrop, wait pill | opacity; pill translateY(6px)→0 | 240ms | `--ease-out` |
| Stage screen change | instant cut (keep) | 0 | n/a |

### How overlays enter and leave

| Overlay | What it is | Enter | Leave | Dismiss | Focus |
|---|---|---|---|---|---|
| **Inline status** (Play window and any place a toast would cover its source) | `role="status"` text beside the triggering buttons | opacity 0→1, 120ms | opacity →0 after 3s, 200ms | automatic | doesn't take focus |
| **Toast** (page-level confirmations only) | `role="status"`, bottom center, max-width min(420px, 100vw − 32px), at most two lines, bottom calc(16px + safe-area) | opacity 0→1 and translateY(8px)→0, 200ms `--ease-out` | opacity →0 and translateY(4px), 160ms `--ease-in` | after 3s + 50ms per character (cap 6s); pauses on hover and focus-within; tap or Esc dismisses; a new toast replaces the old one | doesn't take focus. Placement rule: never over its source control; inside a dialog, use the inline status |
| **Next-step sheet** | non-modal bottom sheet; full width below 768px, 760px centered above; hairline border and overlay shadow; top corners 14px | opacity 0→1 and translateY(24px)→0, 280ms `--ease-out` | opacity →0 and translateY(16px), 200ms `--ease-in` | Done, Esc. Doesn't close by itself. A new copy replaces its contents in place (text crossfade 120ms, no re-entry) | focus to the sheet heading (tabindex −1) on open; back to the trigger on close |
| **Dialog** (Play window, copy-by-hand) | native `<dialog>` with `showModal()`; `height:auto; max-height: calc(100dvh − 32px)`; 14px radius; backdrop rgba(20,36,52,.5) | backdrop opacity 0→1 over 200ms; panel opacity 0→1 and translateY(8px)→0 over 240ms `--ease-out` | panel opacity →0 and translateY(4px) over 160ms `--ease-in`; backdrop 160ms | Close, Esc; a backdrop click closes the Play window only when no code edits are unsaved | focus to the dialog title (tabindex −1); back to the opening button on close |
| **Frame placeholder** (inside Play) | cream panel with "Starting <tool>…" | present from the first frame | crossfade to the tool on `load`, 160ms | n/a | n/a |
| **Part-changed notice** | part of the sticky now bar (I14) | text crossfade 200ms; copper rule draws in 360ms | rule fades after 6s, or on Got it, over 200ms | Take me there, Got it | doesn't take focus; `role="status"` announces "Now: Grant a wish" |
| **Stage controls** | toolbar, top right | opacity 0→1 over 120ms on pointer move, touch, or `:focus-within` | opacity →0 over 200ms 2.5s after the last movement (4s on coarse pointers), then `visibility:hidden` | automatic | keyboard focus reveals them and keeps them shown |
| **Stage clock, large** | centered 592×344 pane over a navy rgb(20,36,52)/.96 scrim, no blur | FLIP transform from the corner, 360ms `--ease-move`; scrim 240ms | reverse, 300ms | C, Esc, click outside, "Make the clock small" | focus to "Make the clock small"; back to the clock face on close |

Dialog enter and leave without JS timers, with an instant fallback where unsupported:

```css
dialog { opacity: 0; transform: translateY(4px);
  transition: opacity var(--dur-exit) var(--ease-in), transform var(--dur-exit) var(--ease-in),
              overlay var(--dur-exit) allow-discrete, display var(--dur-exit) allow-discrete; }
dialog[open] { opacity: 1; transform: none;
  transition-duration: 240ms; transition-timing-function: var(--ease-out); }
@starting-style { dialog[open] { opacity: 0; transform: translateY(8px); } }
dialog::backdrop { background: rgba(20,36,52,0); transition: background-color 200ms var(--ease-out),
              overlay 200ms allow-discrete, display 200ms allow-discrete; }
dialog[open]::backdrop { background: rgba(20,36,52,.5); }
@starting-style { dialog[open]::backdrop { background: rgba(20,36,52,0); } }

details[open] > :not(summary) { animation: fold-in var(--dur-2) var(--ease-out); }
@keyframes fold-in { from { opacity: 0; transform: translateY(-4px); } }
```

### Reduced motion

With `prefers-reduced-motion: reduce`, nothing moves. State still shows through color, fill, border and opacity, which aren't motion.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important; animation-iteration-count: 1 !important;
  }
  :root { --lift: none; --press: none; }
  .toast, .sheet, dialog, details > :not(summary), .chev { transform: none !important; }
}
```

- Hover, press and done keep their 120ms color and fill changes. The press nudge and card lift go away; the card's shadow and border change remain.
- Toasts, sheets and dialogs fade only, capped at 120ms in and out.
- Disclosure chevrons snap to their open angle; content appears at once.
- The stage clock crossfades between its corner and large states (opacity, 120ms) instead of gliding; the wait pill appears without rising; the key-hint line hides without fading.
- The now bar's copper rule appears at full width, with no draw-in.
- In-page jumps are instant (already true).
