# Accessibility

The target is WCAG 2.1 AA, with the WCAG 2.2 AA items that matter for this site (focus not hidden, target size).

## What was checked

On October 7, 2026, an automated and scripted review covered the participant page and the Oracle in Chrome, in light and dark themes, at 320px wide, and at 683×384 (a 1366×768 Chromebook at 200% zoom). It found two blockers and nine should-fix items, all fixed the same day:

- A navy focus ring in the light theme (the sky ring was 2.03:1 on white)
- Messages inside the Play window now appear and are announced inside it
- Finished agenda items and "Coming soon" text no longer fade below 4.5:1, and screen readers hear "(finished)" and "(happening now)"
- `scroll-padding-top` keeps focused items clear of the sticky bar, which stops sticking on very short screens
- The copy-by-hand box is labeled, and the wish-jar buttons say they copy
- The sparkles twinkle twice and rest, and the Oracle swirls only while it thinks
- Buttons, chips, and text boxes have 3:1 borders
- The code editor stays usable at 200% zoom, and messages stay up seven seconds and pause on hover
- The Oracle has a sound switch, and no fade under reduced motion

Already passing then: text contrast at full opacity in both themes, the heading outline and landmarks, the skip link, focus handling in the Play window, reflow at 320px, and target sizes.

## Since then

The site grew into several pages, four starters, the presenter view, the speaker notes, and the Hosts page. They follow the same patterns (labels, the same focus ring and contrast tokens, reduced-motion rules), but they have not had a separate audit.

## Still needs a person

- A pass with NVDA and Chrome, or ChromeVox, for the messages, the next-step panel, and the Oracle's prophecy
- VoiceOver on iOS for the Play window
- Real keyboard use of every button, and Escape inside a running starter
- An audit of the four starters and the presenter view

An automated and scripted review can't certify compliance on its own.

## When people share what they build

Tools made with AI on Friday haven't been checked. Before anyone shares one beyond their team, check it with a keyboard, for contrast, and for labels on every control.
