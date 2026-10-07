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
- **Hosting.** GitHub Pages at inquiredu.org/a-mn-hackathon, from the private repo inquiredu/a-mn-hackathon. The working folder lives in Google Drive so it's reachable from the Windows PC and the Mac mini.

## What exists

| Page | Address | What it does |
| --- | --- | --- |
| Home | `/` | Changes with the clock: the invitation before, "Happening now" during, a keepsake after |
| Starters | `/starters.html` | The five starters with Play, Copy for my AI, and remix menus |
| Grant a wish | `/wish.html` | The build path, the wish builder, the wish jar, the stuck moves |
| Hosts | `/hosts.html` | Forming teams, a room calculator, the run of show, before/during/after |
| Sources | `/sources.html` | How-tos, cautions, and research on coding and thinking |
| Present | `/present.html` | The full-screen stage for the main room (S opens speaker notes) |
| Speaker notes | `/notes.html` | Follows the stage from a second window, and can move it |

Shared spaces: the [Teams doc](https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit) (in Sean's personal Google account), plus a gallery wall and a wonder-and-worry wall still to be made.

## Still to do

- Make the gallery and wonder-and-worry slides and add their links to `assets/session.js`.
- Share the Teams doc ("anyone with the link can edit"), ideally Friday morning.
- Test pasting a starter into Gemini (Canvas on) on a district account, and in Claude and ChatGPT.
- Edit the speaker notes in `assets/session.js` into Sean's own words.
- A manual screen-reader pass (NVDA or ChromeVox, and VoiceOver). See `docs/ACCESSIBILITY.md`.
- Get planner feedback on the starters.

## Working on it

- Git lives inside the Drive folder. Use one computer at a time and let Drive finish syncing before switching.
- Preview locally with `node scripts/serve.js`, then open http://localhost:4178. Add `?now=10:50` to any page to see it at that moment on the day.
- Commit and push from either computer; the live site updates in about a minute.

## Starter prompt for a new chat

> I'm working on "Hands On," a one-link site for a two-hour virtual hackathon (MNGAIA · AI4MN, Friday October 9, 2026). The project is in this folder; start by reading `docs/HANDOFF.md`, `docs/SESSION-KIT.md`, and `README.md`. Everything about the morning lives in `assets/session.js`. Keep the MNGAIA look, plain warm language, WCAG 2.1 AA, and made-up data only. Ask me before publishing anything.
