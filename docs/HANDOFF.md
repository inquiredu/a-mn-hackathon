# Handoff: Hands On, Friday October 9, 2026

Use this to pick the work up on another computer or in a new chat. It records what was decided, what exists, and what's left.

## The session

A two-hour virtual hackathon for MNGAIA · AI4MN on Google Meet, 10:00 to noon Central, for about 35 to 50 K-12 educators and leaders, most of whom have never coded. It sits between a heavy policy session and November's session on assessment, so the tone is play with a purpose: people build small tools with AI that are worth opening on Monday, and show one person.

## Decisions
- **Three levels of getting started with code, shown live, then self-selected.** (October 9, the morning of.) After the 1-to-5 chat, a 12-minute part named Three levels of getting started: the stage names the three levels (in the chat, on your site, behind the scenes), then Sean shares Chrome and runs three tabs he set up before 10:00: the Oracle pasted into a chat; a department charter turned into an interactive infographic in Gemini Canvas and pasted into a Google Site with Insert › Embed › Embed code; and an Apps Script that inventories a Drive folder into a Sheet. Show & Tell follows ("done one of these?"), and ends with everyone adding their name under a level in the Teams doc; the co-host makes rooms of up to four from each level's list, partners together, 4s and 5s as anchors where they fall. Nobody is sorted. Watch one get built is gone. `levels.html` carries each level's example, prompt, and steps, level 3's script and caution, a "pick your level" section, and a glimpse of level 4 (the workbench: Claude Code, Codex), which the close also names on a "Where this goes" screen. The stage has a `ladder` kind for it. Sources has a "The three levels" group and a "Picked a level?" path.
- **The opening runs on chat, then one builder shows.** Welcome walks the plan for the morning (the stage builds it from the session file), then asks two things in the chat: how much have you built with AI, 1 to 5 (1: not yet; 5: I'm having a hard time stopping), and, for builders, what was it. The co-host takes the anchors from those answers, so nobody opens the Teams doc at Welcome. Then **Show & Tell** (8 minutes, taken from the Remix Arcade, now 17; it was "Show & Tell" until October 8, which read as a joke): one or two builders from the chat share their screen. Meet's Host controls keep "Share their screen" on for everyone, so no one needs to be a co-host. Chat is recorded, so it carries what docs used to: answers, wishes, and any change of plan.
- **A session clock that moves.** The stage opens with the two hours large under the MNGAIA mark ("2:00:00") and a **Call to order** button (or T). Called to order, it counts down to the second; on the next screen it glides into the rail's corner ("1:18:04 left", a thin progress line across the rail, coral and "+0:05:12 over" past the end). Click it, or press C, and it floats above the stage on a pane of frosted glass (navy to sky, the dimmed slide showing through), with **Wait time** buttons (1, 2, 3, 5 minutes) for think time; the running wait is the big figure, the chosen button stays lit, and Clear appears only while a wait is on. Esc or a click outside sends it back, and a running wait follows it to the corner as a small pill above the clock. Uncalled on the day, it counts from the advertised start; on any other day it waits, so a rehearsal starts clean. The notes window shows the same count, with Call to order and Reset.
- **A live timer on the stage, not a live schedule.** Show & Tell, the breakout rooms (one 57-minute timer that keeps counting across the Remix Arcade and Grant a wish screens), Show & Cheer, and the wonder-and-worry close have a countdown the presenter stretches or shrinks as the conversation goes (from What We Talk About's timer). Nothing on the stage counts down to a clock time any more: the old breakout countdown read the real clock, so on any other day, or once 11:35 had passed, it showed a giant "Time". The participant pages still run on the session file's clock; a static site can't hear the stage, so when the plan changes, a host says so in the chat. Breakout rooms close on Meet's own timer, which the co-host sets.
- **Play is the method; usefulness is the product.** Four starters for real work (Meeting Timer, Group Maker, Feedback Builder, Calendar Explorer) plus the Teacher's Lounge Oracle, kept for whimsy and used to open and close the morning. Since the evening of October 8 the Oracle is a glass orb on a gold tripod with the AI4MN mark inside (drawn in SVG from Sean's 3D model, `oracle-1c-tripod.glb`, so the page stays one pasteable file), and it answers the way a stage mentalist does. The voice is light and punny, with more yeses than nos and the nos gentle. A yes-or-no question gets a verdict ("Yes, with sprinkles." "Gently, no."), then the question turned around in the second person by a short swap list ("Will I finish grading tonight?" becomes "You will not finish grading tonight."; ELIZA did this in 1966), then an omen from the topic the question touched, or a sign-off. The echo only speaks when the sentence parses (a pronoun, a determiner with its noun, or a Name as the subject; did-questions and or-questions get no echo). What, when, who, where, why, and how questions take a list the topic keeps for that kind ("What's for lunch?" names a food), or the kind's own answers. Before all that: silence gets an answer, a short hello or thanks gets manners, and either/or picks a side. Plurals and endings count toward a topic; the one mentioned most or last wins. It remembers the last question, says everything once before repeating, and `scripts/test-oracle.js` checks all of it on every commit. The close's `listensFor` screen still tells the truth: a person chose the words.- **Teams of at most four.** Formed with the Teams doc: anyone who has built something interactive adds their name as an anchor, the co-host shuffles rooms and drags one anchor into each, and everyone adds their name to their room's row.
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
| Present | `/present.html` | The full-screen stage for the main room: a session clock you call to order, which then lives in the corner and opens large for wait time (C); live timers on Show & Tell, the breakout rooms, Show & Cheer, and the close (T, +, −); S opens speaker notes. Works on a phone too: the controls stay visible, tall screens scroll, and the corner clock sits above the rail |
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

The Session slides deck matches the site as of the evening of October 8: lengths instead of clock times, Grant a wish at 40 minutes (57 minutes of building in all), the 1-to-5 Welcome slide, and a Show & Tell slide (copied from Watch one get built, so its speaker notes are that slide's until someone edits them). The site now calls that part Show & Tell; the deck's slide still says Show & Tell until someone renames it. It has no plan slide; the site's stage does. The two backups are named by what's inside them, on the site and in Drive (renamed October 8; the starter deck had been titled "Facilitation Slides - 10.9"). Both are owned by Sean's Orono account and shared with the AI4MN co-hosts. If the site is blocked, nobody sees the site's links, so the chat messages on the Hosts page carry them too.

## Still to do

### This morning, before 10:00

- Share the Teams doc ("anyone with the link can edit").
- Set Meet's breakout timer to 57 minutes, the whole stretch in rooms (the Remix Arcade's 17 plus Grant a wish's 40). The co-host sets it; the site can't.
- In Meet's Host controls, keep "Share their screen" on for everyone, for Show & Tell and Show & Cheer.
- Tell the co-host the room routine: rooms come from the three level lists in the Teams doc (up to four each, partners together), not from a shuffle; put a 4 or 5 from the Welcome chat in each room where it works; write room numbers in the Room column.
- Sean, in Chrome: tab 1, an AI chat with the Oracle pasted in and running; tab 2, Gemini with Canvas on and the charter ready, plus the Google Site open to edit; tab 3, the Apps Script editor with the Drive Inventory from `levels.html`, the folder's ID in place, run once so the permission screen is behind you. Share Chrome as a window.
- On the presenting computer: open Present, press F, and check the session clock on the opening screen. Call to order when you start, or it counts from 10:00 on its own.
- ⚠️ Not verified: whether Google Sites caps the length of pasted embed code, and whether its sandbox breaks anything the starters rely on. Starters carries a note and a prompt stem for a lighter version if Sites refuses.

### After the session, from the Windows PC: polish and ADA, the final work

The site design is getting heavy. Eleven commits landed between the evening of October 8 and the morning of October 9, and it shows: the look is uneven from page to page, and some pages scroll too long. This is the last work planned for the site, done from the PC, and it has two parts.

- **Polish.** Walk every page at desktop and phone width and make them read as one site: the same spacing, the same card and section rhythm, the same weight of headings. Candidates for the long scroll: Starters (nine starters in three levels, each with a remix menu), Three levels (three full levels, a script, and a caution box), and Hosts (materials, team forming, the run of show, and the guide). Favor fewer, denser sections over more copy: collapse what's reference into `details`, move what's duplicated to one place, and cut what the day proved unnecessary. Keep the one-source rule: times, links, and stage copy stay in `assets/session.js`.
- **ADA.** The WCAG 2.1 AA pass in `docs/ACCESSIBILITY.md`: a manual screen-reader pass (NVDA or ChromeVox, and VoiceOver) over the nine starters, the Three levels page, the stage with its clock and timers, and the Play window; contrast in both themes after any polish; focus order and visible focus on every button the polish touches; reduced motion honored by the new starters.
- Do the polish first and the ADA pass last, so the audit covers what ships.

### Loose ends, any time

- The walls deck has three slides before the wonder and worry slides ("Collaborative Walls Drive Engagement", one with no text, "Best Practices for Wall Facilitation"). The links jump straight to the wall slides, but delete those three if they weren't meant to be there.
- The Starter code backup deck (`companion`) doesn't have the four new starters (two pages, two scripts) and still holds the Oracle's older code and look. Paste the current `cabinets/` files in when you next open it, or point people at the site.
- Open the site on a district laptop from another district (Donna's isd742.org account is a good test) to see whether a web filter blocks it.
- Test pasting a starter into Gemini (Canvas on) on a district account, and in Claude and ChatGPT.
- Edit the speaker notes in `assets/session.js` into Sean's own words.
- Get planner feedback on the starters.
- Recheck the AI tools' help pages: ChatGPT moved from canvas to a Preview switch in May 2026, and Gemini Canvas sharing depends on each district's Drive settings.

## Working on it

- Since October 8 the Mac works from a plain clone at `~/Documents/VIBECODE/a-mn-hackathon`, outside Drive. ⚠️ If the Drive copy is still in use on the Windows PC, pull there before working, so the two don't drift.
- Preview locally with `node scripts/serve.js`, then open http://localhost:4178. Add `?now=10:50` to any page to see it at that moment on the day.
- Work on a branch and open a pull request; the live site updates about a minute after it merges to `main`. `CLAUDE.md` has the rules for changing the site, and `docs/DECISIONS.md` logs each decision with its date and reason.

## On the Windows PC

The repo carries checks that run before every commit and every push. They stop credential files (`.env`, service-account JSON, private keys) and anything shaped like an API key. Then they check the session file and every page the way the browser reads them, and run the timer tests. Git doesn't turn them on from a clone, so each computer does it once. The Mac is done; the PC isn't. Use Git Bash, which comes with Git for Windows, from the repo folder.

1. Bring the PC up to date. Use a git clone, not the old Drive copy: `git switch main`, then `git pull`. Main now holds everything from October 9 (the three levels, the nine starters, the merged stage work).
2. Check that Node is installed: `node --version`. The checks need it on the PATH. Without it, commits and pushes are blocked, not let through.
3. Turn the checks on, once per clone: `git config core.hooksPath .githooks`.
4. Test them without committing or pushing. Each should print `session check: 7 parts, 7 links, 8 pages, all clear`, then the stage timer and Oracle test lines:
   - Commit check: `sh .githooks/pre-commit`
   - Push check: `echo "refs/heads/main $(git rev-parse HEAD) refs/heads/main 0000000000000000000000000000000000000000" | sh .githooks/pre-push`
5. If either says `Cannot find module`, Git Bash isn't handling the checks' temporary folder. Commits will be blocked until that's fixed. To get past it once, on purpose, use `git commit --no-verify`, then ask a Claude session to fix the hooks for Windows.

The checks haven't been run on Windows yet; the Mac has. A commit or push the checks stop names the file and the problem, and never prints a key's value. GitHub Desktop and other apps run the same checks, but only if they can find Node.

## Starter prompt for a new chat

> I'm working on "Hands On," a one-link site for a two-hour virtual hackathon (MNGAIA · AI4MN, Friday October 9, 2026). The project is in this folder; start by reading `CLAUDE.md`, then `docs/HANDOFF.md`. Everything about the morning lives in `assets/session.js`. Keep the MNGAIA look, plain warm language, WCAG 2.1 AA, and made-up data only. Ask me before publishing anything.
