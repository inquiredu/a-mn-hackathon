# Motion, measured in a real browser

The frame strips in your packet are screenshots sampled from headless Chrome every 30–80 ms after an action. They are reliable for things that appear or vanish without a transition (they show the end state in the first frame), but headless Chrome did not render the stage clock's CSS transitions, so those were measured instead in a real Chrome window by sampling the element's box every ~90 ms. The values below are facts, not estimates.

## The stage's session clock (present.html, 1280×720)

- **Title screen → corner** (after Call to order, pressing next): the clock glides from the left of the title screen to the right corner of the rail over about 0.7 s on a fast-out curve (cubic-bezier(.22, 1, .36, 1)); about 90% of the distance is covered in the first 0.4 s.
- **Opening it large** (C, or a click): it grows from the corner to a centered 592×344 pane over about 0.6 s, the frosted-glass layer fading in alongside (opacity 0.46 at 100 ms, 0.92 at 285 ms, 1.0 by 565 ms); a dim backdrop fades in over 0.5 s.
- **Making it small** (Esc, a click outside, or "Make the clock small"): the reverse, settled by about 0.55 s.
- A wait-time pill rises in over 0.5 s (fade and a small lift with a slight scale).

## The stage's screens

- Moving between screens is an instant cut: no transition or animation on the stage.
- The presenter controls sit at 25% opacity and fade to full on hover over 0.2 s.
- The key-hint line fades out after 6 s.

## The site

- **Buttons, links, nav items, cards**: no transitions anywhere; hover and focus changes are instant. No card lifts on hover.
- **The Play window** (a native dialog) appears instantly; the starter inside paints when its frame loads (about 170–350 ms). It closes instantly.
- **The next-step panel** (after Copy for my AI or a wish) appears instantly at the bottom of the window, with no entrance; "Done" removes it instantly. It does not close itself.
- **The toast** (a short message at the bottom center) fades in and rises 20 px over 0.2 s, stays 7 s (paused while hovered), and fades out over 0.2 s.
- **Remix menus and other folds** (native details/summary) open and close instantly.
- **The part-changed notice** (Home during the event) appears instantly under the now bar.
- **In-page links** ("Start here", "See the plan") scroll smoothly (native smooth scrolling; instant under reduced motion).
