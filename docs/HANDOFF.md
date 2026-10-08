# Handoff: Hands On, Friday October 9, 2026

Use this to pick the work up on another computer or in a new chat. It records what was decided, what exists, and what's left.

## The session

A two-hour virtual hackathon for MNGAIA · AI4MN on Google Meet, 10:00 to noon Central, for about 35 to 50 K-12 educators and leaders, most of whom have never coded. It sits between a heavy policy session and November's session on assessment, so the tone is play with a purpose: people build small tools with AI that are worth opening on Monday, and show one person.

## Decisions

- **Play is the method; usefulness is the product.** Four starters for real work (Meeting Timer, Group Maker, Feedback Builder, Calendar Explorer) plus the Teacher's Lounge Oracle, kept for whimsy and used to open and close the morning.
- **Teams of at most four.** Formed with the Teams doc: anyone who has built something interactive adds their name as an anchor, the co-host shuffles rooms and drags one anchor into each, and everyone adds their name to their room's row.
- **Designed for Meet's limits.** Breakout chats are separate and start empty, and Meet can't message every room, so the page carries the time cues and the Teams doc carries the wishes. "Stuck?" points to Meet's Ask for help button.
- **Never more than two windows.** Meet (or Meet's floating picture-in-picture) plus the AI tool, with the page beside it.
- **A reusable session kit.** One session file feeds the participant pages, the presenter view, the speaker notes, and the Hosts page. Clock-driven for Friday; live sync from the presenter is a later idea.
- **Times live only in the session file.** The session has one start and end, each part has a length in minutes, and every time, date, and length on the site is written as `{braces}` that `assets/timing.js` fills in. Changing one part's length moves everything after it, everywhere.
- **A visual gallery wall.** Builders paste a screenshot of their work onto one slide and link the picture to the real thing. A link from a school account may open only inside that district (Gemini follows the district's Drive settings; ChatGPT Edu and Claude Team links stay inside the workspace), so the picture is what everyone can see. The walls deck is set so anyone with the link can edit it, which people from other districts need, and which also means anyone who finds the site can edit it.
- **Present is off the site's menu.** It's for one person, and it was the brightest button in every page's menu. It lives on the Hosts page.
- **Hosting.** GitHub Pages at inquiredu.org/a-mn-hackathon, from the private repo inquiredu/a-mn-hackathon. The working folder lives in Google Drive so it's reachable from the Windows PC and the Mac mini.

## What exists

| Page | Address | What it does |
| --- | --- | --- |
| Home | `/` | Changes with the clock: the invitation before, "Happening now" during, a keepsake after |
| Starters | `/starters.html` | The five starters with Play, Copy for my AI, and remix menus |
| Grant a wish | `/wish.html` | The build path, the wish builder, the wish jar, the stuck moves, and how to pin your work to the gallery wall (`#wall`) |
| Hosts | `/hosts.html` | Forming teams, a room calculator, the run of show, before/during/after |
| Sources | `/sources.html` | 39 sources checked October 7 and 8, with start-here paths, section tabs, topic and kind filters (topics grouped under Building, Taking care, and Teaching and learning), search, and a shareable address for every view (for example `?ask=privacy`, `?path=leaders`, `#primm`). The sources live in `assets/sources-data.js`. |
| Present | `/present.html` | The full-screen stage for the main room (S opens speaker notes) |
| Speaker notes | `/notes.html` | Follows the stage from a second window, and can move it |

Shared spaces and decks, all linked from `links` in `assets/session.js` (none of the pages type out a link). Each part of the morning names the links it uses (`shared`), so they appear on that part's row of the timeline and on the "Happening now" card at that moment, not in a list at the bottom.

| Link | What it is | Where people meet it |
| --- | --- | --- |
| `meet` | The [Google Meet](https://meet.google.com/wvq-zzwe-kny) | Home: first button of the invitation, and "Back to Google Meet" on the Happening now card. Hosts |
| `teams` | The [Teams doc](https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit), in Sean's personal Google account | Welcome and Remix Arcade rows; Starters; Hosts |
| `gallery` | Three slides in a row at the end of the walls deck; the link opens the first | Grant a wish and Show & Cheer rows; the how-to at `wish.html#wall`, linked from Starters step 4; the ten-minute room message; Hosts |
| `wonder`, `worry` | One slide each in the walls deck, "Interactive Workshop Walls" | The close row and section; Hosts |
| `backup` | **Session slides**: the whole morning, screen by screen. Drive title "Hands On 10.9 · Session slides (backup)" | Before you come; the Welcome chat message; Hosts |
| `companion` | **Starter code**: every starter's code and remix menu, in the speaker notes. Drive title "Hands On 10.9 · Starter code (backup)" | Before you come; the breakout-room chat message; Hosts |

The two backups are named by what's inside them, on the site and in Drive (renamed October 8; the starter deck had been titled "Facilitation Slides - 10.9"). Both are owned by Sean's Orono account and shared with the AI4MN co-hosts. If the site is blocked, nobody sees the site's links, so the chat messages on the Hosts page carry them too.

## Still to do

- The walls deck has three slides before the wonder and worry slides ("Collaborative Walls Drive Engagement", one with no text, "Best Practices for Wall Facilitation"). The links jump straight to the wall slides, but delete those three if they weren't meant to be there.
- Share the Teams doc ("anyone with the link can edit"), ideally Friday morning.
- Test pasting a starter into Gemini (Canvas on) on a district account, and in Claude and ChatGPT.
- Edit the speaker notes in `assets/session.js` into Sean's own words.
- A manual screen-reader pass (NVDA or ChromeVox, and VoiceOver). See `docs/ACCESSIBILITY.md`.
- Get planner feedback on the starters.
- Recheck the AI tools' help pages close to Friday: ChatGPT moved from canvas to a Preview switch in May 2026, and Gemini Canvas sharing depends on each district's Drive settings.

## Working on it

- Git lives inside the Drive folder. Use one computer at a time and let Drive finish syncing before switching.
- Preview locally with `node scripts/serve.js`, then open http://localhost:4178. Add `?now=10:50` to any page to see it at that moment on the day.
- Commit and push from either computer; the live site updates in about a minute.

## Starter prompt for a new chat

> I'm working on "Hands On," a one-link site for a two-hour virtual hackathon (MNGAIA · AI4MN, Friday October 9, 2026). The project is in this folder; start by reading `docs/HANDOFF.md`, `docs/SESSION-KIT.md`, and `README.md`. Everything about the morning lives in `assets/session.js`. Keep the MNGAIA look, plain warm language, WCAG 2.1 AA, and made-up data only. Ask me before publishing anything.
