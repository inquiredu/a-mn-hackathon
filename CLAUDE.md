# First Builds: working in this repo

First Builds: small tools to build with AI, and a two-hour session kit to run them, live at inquiredu.org/a-mn-hackathon from GitHub Pages. First run as Hands On, a virtual hackathon for MNGAIA · AI4MN on Friday October 9, 2026. Plain HTML, CSS, and JavaScript: no build step, no dependencies, no tracking.

Read `docs/HANDOFF.md` first: what's decided, what exists, what's left. `docs/SESSION-KIT.md` is the reference for the session file, its braces, and the kinds of stage screen.

## The rules that keep it working

- **One source: `assets/session.js`.** Times, parts, links, stage screens, speaker notes, host checklists, and chat messages all live there, and every page reads it. A link or a time typed into a page is a second copy that will drift; put it in the session file and reach it with a `link-slot`, a `{brace}`, or `{links.name}`.
- **Lengths, not clock times.** Pages and the stage say how long a part runs ("35 min"); only the advertised `{start}` and `{end}` appear as times. Write new copy with `{building}`, `{wish.length}`, or "with {nudge} left". The clock still decides which part is on, so the presenter can stretch the morning without the screen claiming a start time that's no longer true.
- **Braces fill only inside `data-fill`** on a page (anywhere in the session file). A brace the clock doesn't know shows on the page as typed.
- **Figures come from tested functions.** The stage timer and session clock live in `assets/stage-timer.js`; change them with `node scripts/test-stage-timer.js` green.
- **Made-up data only**, in starters, examples, and wishes. Real names belong only in the Teams doc and the walls, which participants fill on the day, and in From the room (`from-the-room.html`), by first name only, for what someone showed or said to the whole room, out loud or in the meeting chat: never surnames, districts, email addresses or phone numbers, or side conversations. Link a person's own site or profile only when they shared it in the room.
- **From the room is a record, so it is checked against the recording's transcript and the meeting's chat,** not an AI summary of them, and says only what they support. Links are the ones people posted; an entry without one says "Link to come." The chat's clock runs apart from the recording's, so a chat post says "in the chat" instead of a time. A quote is word for word, with ums and repeats taken out and obvious transcription slips fixed; an ellipsis marks anything else left out. Quotes live in Themes and are credited to the moment (a room report, a demo, the host, the chat), not the person. A question answered afterward is marked Researched, sits in its own group, says what in the record prompted it, and rests on primary sources (the vendor's documentation, the statute or regulation, the agency, the published study) listed with the date they were checked; it is our reading of those sources, never a ruling for a district, and a claim we couldn't confirm stays out. The meeting's Gemini notes are linked as they are (Sean's call, October 12), though the doc holds the invite list's email addresses, full names, and a link to the recording: the page links it and never copies from it.
- **Voice and look:** plain, warm, exact copy. The site is Sean Beaverson's work, so it wears his North Shore look (`assets/brand/`, from `BrandID/North Shore Design System`); inquiredu.org is only where it lives. MNGAIA · AI4MN lead the credits: their mark in its own colors beside their name, with no label phrase ("Prepared for and presented with" was dropped October 11), never their palette for the interface. Sean's identity appears only at the lower left: his mark, "s.beaverson", and the CC BY-NC-SA 4.0 license, at the foot of every page and in the stage's rail. WCAG 2.1 AA, checked at 375px in light and dark.

## Checks

Once per clone: `git config core.hooksPath .githooks`. Then every commit stops on credential files or anything shaped like an API key, and every commit and push runs `node scripts/check-session.js` (the session file and every page's braces and scripts, read the way the browser reads them, and the pages' stamps) and the timer tests. Run them yourself after editing the session file, a page, or a script.

**After changing any stylesheet or script in `assets/`, run `node scripts/stamp-assets.js`.** Pages load each one as `file?v=` plus a stamp of its contents, so a browser that kept the old file (GitHub Pages lets it, for ten minutes) fetches the new one with the new page instead of showing new markup with old styles. The check stops a commit whose stamps are stale. The session file is never stamped: hosts edit it in the browser.

## Seeing a change

`node scripts/serve.js`, then http://localhost:4178. Add `?now=10:50` to any page, the stage included, to see it at that moment on the day. The stage (`present.html`) and speaker notes (`notes.html`) talk over a BroadcastChannel, so test them as two tabs of the same browser.

## Publishing

The live site is public and is the thing people open on the day. Work on a branch, open a pull request, and let Sean merge: the site updates about a minute after `main` moves. Google files (the Teams doc, the decks) belong to Sean's accounts and are shared with co-hosts; change them only when asked.
