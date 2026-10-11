# Design audit evidence

The record behind `docs/DESIGN-AUDIT.md` (October 11, 2026).

- `brief.md`: everything each reviewer was told. Each also got one packet listing its screenshots, in order, with captions.
- `reviews/`: the fourteen reviews, whole. Finding IDs in the audit point here. File names in them (`after-375-light-s03.png`, `states/play-timer-375-light.png`) are screenshots from the capture, which isn't kept in the repo (about 820 images); `scripts/design-audit/` makes them again.
- `facts/contrast.md`: text contrast in the states the October 11 contrast pass skipped, with hover and focus forced.
- `facts/motion-notes.md`: motion measured in a real browser.

The measured inventory of every control's states (`inventory.md`, about 190 KB) is rebuilt by `scripts/design-audit/inventory.js`.
