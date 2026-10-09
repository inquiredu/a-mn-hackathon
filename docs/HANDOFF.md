# Handoff: Hands On, Friday October 9, 2026

Use this to pick the work up on another computer or in a new chat. It records what was decided, what exists, and what's left.

## The session

A two-hour virtual hackathon for MNGAIA · AI4MN on Google Meet, 10:00 to noon Central, for about 35 to 50 K-12 educators and leaders, most of whom have never coded. It sits between a heavy policy session and November's session on assessment, so the tone is play with a purpose: people build small tools with AI that are worth opening on Monday, and show one person.

## Decisions

- **The opening runs on chat, then one builder shows.** Welcome walks the plan for the morning (the stage builds it from the session file), then asks two things in the chat: how much have you built with AI, 1 to 5 (1: not yet; 5: I'm having a hard time stopping), and, for builders, what was it. The co-host takes the anchors from those answers, so nobody opens the Teams doc at Welcome. Then **Show us yours** (8 minutes, taken from the Remix Arcade, now 17): one or two builders from the chat share their screen. Meet's Host controls keep "Share their screen" on for everyone, so no one needs to be a co-host. Chat is recorded, so it carries what docs used to: answers, wishes, and any change of plan.
- **A session clock that moves.** The stage opens with the two hours large under the MNGAIA mark ("2:00:00") and a **Call to order** button (or T). Called to order, it counts down to the second; on the next screen it glides into the rail's corner ("1:18:04 left", a thin progress line across the rail, coral and "+0:05:12 over" past the end). Click it, or press C, and it floats above the stage over a dimmed slide, with **Wait time** buttons (1, 2, 3, 5 minutes) for think time; Esc or a click outside sends it back. Uncalled on the day, it counts from the advertised start; on any other day it waits, so a rehearsal starts clean. The notes window shows the same count, with Call to order and Reset.
- **A live timer on the stage, not a live schedule.** Show us yours, Show & Cheer, and the wonder-and-worry close have a countdown the presenter stretches or shrinks as the conversation goes (from What We Talk About's timer). The participant pages still run on the session file's clock; a static site can't hear the stage, so when the plan changes, a host says so in the chat. Breakout rooms close on Meet's own timer, which the co-host sets.
- **Play is the method; usefulness is the product.** Four starters for real work (Meeting Timer, Group Maker, Feedback Builder, Calendar Explorer) plus the Teacher's Lounge Oracle, kept for whimsy and used to open and close the morning.
- **Teams of at most four.** Formed with the Teams doc: anyone who has built something interactive adds their name as an anchor, the co-host shuffles rooms and drags one anchor into each, and everyone adds their name to their room's row.
- **Designed for Meet's limits.** Breakout chats are separate and start empty, and Meet can't message every room, so the page carries the time cues and the Teams doc carries the wishes. "Stuck?" points to Meet's Ask for help button.
- **Never more than two windows.** Meet (or Meet's floating picture-in-picture) plus the AI tool, with the page beside it.
- **A reusable session kit.** One session file feeds the participant pages, the presenter view, the speaker notes, and the Hosts page. Clock-driven for Friday; live sync from the presenter is a later idea.
- **Times live only in the session file.** The session has one start and end, each part has a length in minutes, and every time, date, and length on the site is written as `{braces}` that `assets/timing.js` fills in. Changing one part's length moves everything after it, everywhere.
- **Lengths on screen, not clock times.** Apart from the advertised start and end, every page, the stage, the notes, and the Hosts run of show say how long each part runs ("35 min"), not when it starts. The plan reads the same if the morning runs long, and the kit carries to another day. The clock still decides which part is on, behind the scenes.
- **A visual gallery wall.** Builders paste a screenshot of their work onto one slide and link the picture to the real thing. A link from a school account may open only inside that district (Gemini follows the district's Drive settings; ChatGPT Edu and Claude Team links stay inside the workspace), so the picture is what everyone can see. The walls deck is set so anyone with the link can edit it, which people from other districts need, and which also means anyone who finds the site can edit it.
- **Hosts stays in the menu, on purpose.** The run of show, speaker notes, and ready-to-paste messages are open to everyone, so people can see how a session like this is built. Present is the last item in every page's menu, styled as a pill, like the What We Talk About site: it opens the full-screen stage (arrow keys, F for full screen, N to jump to now, S for speaker notes).
- **One thing on screen at a time.** During the event, Home shows the Happening now card, the schedule, and only the sections whose part has started (Show & Cheer, the close). Sources keeps the now bar, so a detour there doesn't lose the clock.
- **Hosting.** GitHub Pages at inquiredu.org/a-mn-hackathon, from the private repo inquiredu/a-mn-hackathon. The working folder lives in Google Drive so it's reachable from the Windows PC and the Mac mini.

## What exists

| Page | Address | What it does |
| --- | --- | --- |
| Home | `/` | Changes with the clock: the invitation before, "Happening now" during, a keepsake after |
| Starters | `/starters.html` | The five starters with Play, Copy for my AI, and remix menus |
| Grant a wish | `/wish.html` | The build path, the wish builder, the wish jar, the stuck moves, and how to pin your work to the gallery wall (`#wall`) |
| Hosts | `/hosts.html` | Forming teams, a room calculator, the run of show, before/during/after |
| Sources | `/sources.html` | 39 sources checked October 7 and 8, with start-here paths, section tabs, topic and kind filters (topics grouped under Building, Taking care, and Teaching and learning), search, and a shareable address for every view (for example `?ask=privacy`, `?path=leaders`, `#primm`). The sources live in `assets/sources-data.js`. |
| Present | `/present.html` | The full-screen stage for the main room: a session clock you call to order, which then lives in the corner and opens large for wait time (C); live timers on Show us yours, Show & Cheer, and the close (T, +, −); S opens speaker notes |
| Speaker notes | `/notes.html` | Follows the stage from a second window and can move it; runs the stage timer and the session clock (Call to order, Reset) |

Shared spaces and decks, all linked from `links` in `assets/session.js` (none of the pages type out a link). Each part of the morning names the links it uses (`shared`), and the "Happening now" card shows them at that moment. The timeline is the schedule only.

| Link | What it is | Where people meet it |
| --- | --- | --- |
| `meet` | The [Google Meet](https://meet.google.com/wvq-zzwe-kny) | Home: first button of the invitation (before the event only; during it, people are already in Meet). Hosts |
| `teams` | The [Teams doc](https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit), in Sean's personal Google account | Happening now card at Welcome and the Remix Arcade; Starters; Hosts |
| `gallery` | Three slides in a row at the end of the walls deck; the link opens the first | Happening now card at Grant a wish and Show & Cheer; the how-to at `wish.html#wall`; the ten-minute room message; Hosts |
| `wonder`, `worry` | One slide each in the walls deck, "Interactive Workshop Walls" | Happening now card and the close section, once the close starts; Hosts |
| `backup` | **Session slides**: the whole morning, screen by screen. Drive title "Hands On 10.9 · Session slides (backup)" | Before you come; the Welcome chat message; Hosts |
| `companion` | **Starter code**: every starter's code and remix menu, in the speaker notes. Drive title "Hands On 10.9 · Starter code (backup)" | Before you come; the breakout-room chat message; Hosts |

The Session slides deck matches the site as of October 8: lengths instead of clock times, the 1-to-5 Welcome slide, and a Show us yours slide (copied from Watch one get built, so its speaker notes are that slide's until someone edits them). It has no plan slide; the site's stage does. The two backups are named by what's inside them, on the site and in Drive (renamed October 8; the starter deck had been titled "Facilitation Slides - 10.9"). Both are owned by Sean's Orono account and shared with the AI4MN co-hosts. If the site is blocked, nobody sees the site's links, so the chat messages on the Hosts page carry them too.

## Still to do

- The walls deck has three slides before the wonder and worry slides ("Collaborative Walls Drive Engagement", one with no text, "Best Practices for Wall Facilitation"). The links jump straight to the wall slides, but delete those three if they weren't meant to be there.
- Share the Teams doc ("anyone with the link can edit"), ideally Friday morning.
- In Meet's Host controls, keep "Share their screen" on for everyone, for Show us yours and Show & Cheer.
- Tell the co-host the new anchor routine: the 4s, the 5s, and the builders from the Welcome chat.
- Before 10:00 on the presenting computer: open Present, press F, and check the session clock on the opening screen. Call to order when you start, or it counts from 10:00 on its own.
- Open the site on a district laptop from another district (Donna's isd742.org account is a good test) to see whether a web filter blocks it.
- Test pasting a starter into Gemini (Canvas on) on a district account, and in Claude and ChatGPT.
- Edit the speaker notes in `assets/session.js` into Sean's own words.
- A manual screen-reader pass (NVDA or ChromeVox, and VoiceOver), including the stage's new clock and timers. See `docs/ACCESSIBILITY.md`.
- Get planner feedback on the starters.
- Recheck the AI tools' help pages close to Friday: ChatGPT moved from canvas to a Preview switch in May 2026, and Gemini Canvas sharing depends on each district's Drive settings.

## Working on it

- Since October 8 the Mac works from a plain clone at `~/Documents/VIBECODE/a-mn-hackathon`, outside Drive. ⚠️ If the Drive copy is still in use on the Windows PC, pull there before working, so the two don't drift.
- Preview locally with `node scripts/serve.js`, then open http://localhost:4178. Add `?now=10:50` to any page to see it at that moment on the day.
- Work on a branch and open a pull request; the live site updates about a minute after it merges to `main`. `CLAUDE.md` has the rules for changing the site, and `docs/DECISIONS.md` logs each decision with its date and reason.

## Starter prompt for a new chat

> I'm working on "Hands On," a one-link site for a two-hour virtual hackathon (MNGAIA · AI4MN, Friday October 9, 2026). The project is in this folder; start by reading `CLAUDE.md`, then `docs/HANDOFF.md`. Everything about the morning lives in `assets/session.js`. Keep the MNGAIA look, plain warm language, WCAG 2.1 AA, and made-up data only. Ask me before publishing anything.
