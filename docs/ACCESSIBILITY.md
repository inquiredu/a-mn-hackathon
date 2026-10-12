# Accessibility

The target is WCAG 2.1 AA, with the WCAG 2.2 AA items that matter for this site (focus not hidden, target size).

## What was checked

On October 7, 2026, an automated and scripted review covered the participant page and the Oracle in Chrome, in light and dark themes, at 320px wide, and at 683×384 (a 1366×768 Chromebook at 200% zoom). It found two blockers and nine should-fix items, all fixed the same day:

- A navy focus ring in the light theme (the sky ring was 2.03:1 on white)
- Messages inside the Play window now appear and are announced inside it
- Finished agenda items and "Coming soon" text no longer fade below 4.5:1, and screen readers hear "(finished)" and "(happening now)"
- `scroll-padding-top` keeps focused items clear of the sticky bar, which stops sticking on very short screens
- The copy-by-hand box is labeled, and the wish-jar buttons say they copy (the jar is now the idea jar on Invent your own, and its buttons fill the builder)
- The sparkles twinkle twice and rest, and the Oracle swirls only while it thinks
- Buttons, chips, and text boxes have 3:1 borders
- The code editor stays usable at 200% zoom, and messages stay up seven seconds and pause on hover
- The Oracle has a sound switch, and no fade under reduced motion

Already passing then: text contrast at full opacity in both themes, the heading outline and landmarks, the skip link, focus handling in the Play window, reflow at 320px, and target sizes.

## Since then

The site grew into several pages, four starters, the presenter view, the speaker notes, and the Hosts page. They follow the same patterns (labels, the same focus ring and contrast tokens, reduced-motion rules), but they have not had a separate audit.

On October 8 the Oracle got its tripod and the AI4MN mark. The figure is decorative (`aria-hidden`), it moves only while the Oracle thinks and not at all under reduced motion, and it was checked at 375px wide and on a wide, short screen (the shape of the shared tab). Gold on the night background is 9.4:1 and the sky mutterings 8.6:1; the text boxes' gold borders are 6.9:1.

On October 11 the site moved to Sean Beaverson's North Shore look, with a Night theme drawn from its scales. An automated pass over every page and the stage, in both themes and in the before, during, and after states, measured every visible line of text against its real background: all at AA (4.5:1, or 3:1 for large text) once one older bug was fixed, the timeline's current part, whose link was ivory on white in the light theme. The focus ring is one step darker than North Shore's own: its copper ring (sun-600) measures 2.92:1 on cream, under the 3:1 a focus indicator needs, so the site uses sun-700 (4.04:1 on cream) and sun-500 on navy (5.37:1), drawn as an outline so it survives high-contrast mode. That pass did not cover the cue, toasts, dialogs, open menus, or hover states.

The design pass (October 11, `docs/DESIGN-AUDIT.md`) changed how several things behave, with accessibility built in and checked in the browser:

- The stage's presenter controls fade when idle and return on any mouse move, key press, tap, or focus; keyboard focus inside them keeps them showing, and Tab from the slide reveals them. The room's screen is never the only way to reach a control.
- Copy buttons say "Copied" in place for two seconds and announce it through a live region; the next step after a copy is a docked panel that takes focus and closes with Escape or Done. Empty answers point at their field with `aria-invalid` and a message tied to it, never a toast.
- Toggles show their state in shape and words, not color alone: the Meeting Timer's Chime and the Oracle's Sound say on or off, and the speaker notes mark "following the stage" with a filled dot and "not open" with a hollow one on a button.
- Two-step confirmations (the stage's Reset the clock, the notes' Reset the session clock) keep a fixed width across their two labels, and the notes' reset can be undone for eight seconds.
- Motion (the clock's move, dialogs, folds, the notes' arrival fade, the starters' plus-to-minus) is off under reduced motion.
- A Light/Night toggle: a button named "Night theme" with `aria-pressed`, at the end of the header (in the Menu on a phone, where it also says On or Off) and in the speaker notes' foot. It follows the system setting until pressed, sets the theme before the page paints (no flash), and switches every color at once.
- Contrast re-measured after the pass: 54 groups, every page plus the notes and three stage screens with controls showing, in light and Night, hover and focus forced on every control: all at AA (`docs/design-audit/facts/contrast-after.md`).

## Still needs a person

- A pass with NVDA and Chrome, or ChromeVox, for the messages, the next-step panel, and the Oracle's prophecy
- VoiceOver on iOS for the Play window
- Real keyboard use of every button, and Escape inside a running starter
- An audit of the eight starters (six pages, two scripts shown as text), the Three levels page, and the presenter view, including the session clock (a button that opens a panel above the stage, closes with Escape, and returns focus), the screen timers, and the controls that fade when idle
- The speaker notes' screen list (a modal dialog) and their docked timer and moves, with a screen reader

An automated and scripted review can't certify compliance on its own.

## When people share what they build

Tools made with AI on Friday haven't been checked. Before anyone shares one beyond their team, check it with a keyboard, for contrast, and for labels on every control.
