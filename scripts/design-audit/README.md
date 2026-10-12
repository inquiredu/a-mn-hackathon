# Design audit tools

Screenshots and measurements of every surface, for the design audit in `docs/DESIGN-AUDIT.md`. Node 22 or later (it uses Node's built-in WebSocket), Google Chrome at its usual macOS path, no dependencies. Output goes to a folder you name outside the repo: about 820 screenshots.

```
node scripts/design-audit/capture.js . ~/fb-audit/shots
node scripts/design-audit/inventory.js . ~/fb-audit/facts
node scripts/design-audit/contrast.js . ~/fb-audit/facts/contrast.md
cp docs/design-audit/facts/motion-notes.md ~/fb-audit/facts/
node scripts/design-audit/packets.js ~/fb-audit
```

`capture.js` takes a comma list of jobs as a third argument to re-run only some (`pages,states,sourcesfix,stage,timerfix,notes,notesfix,cabinets,motion`). Each script starts its own copy of `scripts/serve.js` on port 4179 and its own headless Chrome profile, so it never touches your browser, a running preview, or another chat's server on 4178.

`packets.js` writes one packet per reviewer: the images that reviewer may open, in order, with captions. A reviewer gets `docs/design-audit/brief.md` and one packet, and nothing else.

`node scripts/design-audit/packets.js ~/fb-audit re` writes the re-review's nine packets instead (in `packets-re/`): the same images, joined where surfaces belong together and a packet stays near 110 images (Home and Three levels, Starters and Invent your own, Hosts, Sources, the stage and the notes, the Play window, Night's first half with the system, Night's second half, interaction with the journeys). The first audit's `motion-notes.md` is left out of them, since its timings are from before the fixes. Stage screenshots are taken as the room sees them, with the presenter's controls faded; the ones labeled "presenter view" show the controls.

Four traps, each hit once on October 11, 2026:

- Chrome's phone emulation (`mobile: true`) widens the layout viewport when a page is wider than the screen, which hides the bottom of the page from screenshots. Site pages are captured with `mobile: false` plus touch; overflow is measured as `scrollWidth > clientWidth`.
- The stage reads `#n` from its address only when it loads. Load it once and call `show(i)`.
- Headless screenshots don't show CSS transitions as they run. Measure motion in a real browser by sampling an element's box on a timer (`docs/design-audit/facts/motion-notes.md`).
- Wait for the local server to answer before the first page, or the first page measures Chrome's error screen.
