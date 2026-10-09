# Hands On: working in this repo

A one-link site for a two-hour virtual hackathon (MNGAIA · AI4MN, Friday October 9, 2026), live at inquiredu.org/a-mn-hackathon from GitHub Pages. Plain HTML, CSS, and JavaScript: no build step, no dependencies, no tracking.

Read `docs/HANDOFF.md` first: what's decided, what exists, what's left. `docs/SESSION-KIT.md` is the reference for the session file, its braces, and the kinds of stage screen.

## The rules that keep it working

- **One source: `assets/session.js`.** Times, parts, links, stage screens, speaker notes, host checklists, and chat messages all live there, and every page reads it. A link or a time typed into a page is a second copy that will drift; put it in the session file and reach it with a `link-slot`, a `{brace}`, or `{links.name}`.
- **Lengths, not clock times.** Pages and the stage say how long a part runs ("35 min"); only the advertised `{start}` and `{end}` appear as times. Write new copy with `{building}`, `{wish.length}`, or "with {nudge} left". The clock still decides which part is on, so the presenter can stretch the morning without the screen claiming a start time that's no longer true.
- **Braces fill only inside `data-fill`** on a page (anywhere in the session file). A brace the clock doesn't know shows on the page as typed.
- **Figures come from tested functions.** The stage timer and session clock live in `assets/stage-timer.js`; change them with `node scripts/test-stage-timer.js` green.
- **Made-up data only**, in starters, examples, and wishes. Real names belong only in the Teams doc and the walls, which participants fill on the day.
- **Voice and look:** plain, warm, exact copy; the MNGAIA navy and sky; WCAG 2.1 AA, checked at 375px in light and dark.

## Seeing a change

`node scripts/serve.js`, then http://localhost:4178. Add `?now=10:50` to any page, the stage included, to see it at that moment on the day. The stage (`present.html`) and speaker notes (`notes.html`) talk over a BroadcastChannel, so test them as two tabs of the same browser.

## Publishing

The live site is public and is the thing people open on the day. Work on a branch, open a pull request, and let Sean merge: the site updates about a minute after `main` moves. Google files (the Teams doc, the decks) belong to Sean's accounts and are shared with co-hosts; change them only when asked.
