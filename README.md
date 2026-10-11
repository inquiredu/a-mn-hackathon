# First Builds

Small tools you can build with AI in an afternoon or less, for people who run classrooms, schools, and meetings, and a two-hour session kit to run with your own team. It was prepared for and first presented with MNGAIA · AI4MN as Hands On, a virtual hackathon on Friday, October 9, 2026: educators built tools worth opening on Monday, in teams of four, and showed one person what they made. It lives at [inquiredu.org/a-mn-hackathon](https://inquiredu.org/a-mn-hackathon).

**Status:** first run October 9, 2026, and kept here as a kit for anyone. Plain HTML, CSS, and JavaScript. No build step, no dependencies, no tracking, no analytics, no cookies. The code is MIT and the words and pages are [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): fork it and run your own, with credit, not for resale.

## The pages

| Page | For | What it does |
| --- | --- | --- |
| [Home](index.html) | Everyone | Changes with the clock: the invitation before, "Happening now" during, and after, a front door for anyone: the kit, everything on the site, and how to run it with your own team |
| [Three levels](levels.html) | Everyone | Three levels of getting started with code: in the chat, on your site, behind the scenes, each with a prompt and its steps |
| [Starters](starters.html) | Builders | Eight starters across the three levels, to play, copy into an AI tool, and remix |
| [Grant a wish](wish.html) | Builders | Build something from nothing: a wish builder, a jar of wishes, three moves for when you're stuck |
| [Hosts](hosts.html) | Hosts and anchors | Forming teams, a room calculator, the run of show, before, during, and after |
| [Sources](sources.html) | Anyone curious | How-tos, cautions, and research on learning to code |
| [Present](present.html) | The presenter | The main-room stage, with a session clock to call the morning to order and live timers; S opens speaker notes in a second window |

## How it's built

Everything about the morning lives in one session file, `assets/session.js`: the times, the links, the presenter's screens and notes, the hosts' checklists, and ready-to-paste messages. Every page reads it. Plain HTML, CSS, and JavaScript, with no build step and no tracking.

| Path | What it is |
| --- | --- |
| `assets/session.js` | The session file |
| `assets/timing.js` | The clock: lays out the parts and fills in every `{time}` on the site from the session file |
| `assets/site.js`, `assets/site.css` | The participant pages and the Hosts page |
| `assets/hosts.js` | The run of show and the room calculator |
| `assets/sources-data.js`, `assets/sources.js` | The sources as data (add one entry to add a source), and the page that filters them |
| `assets/present.js`, `assets/present.css`, `notes.html` | The stage and the speaker notes |
| `assets/stage-timer.js` | The arithmetic behind the stage's timers and session clock, tested by `scripts/test-stage-timer.js` |
| `cabinets/` | The starters, each a single HTML file that pastes cleanly into any AI tool |
| `recipes/` | The level 3 starters: Apps Scripts, one file each, shown and copied from the pages |
| `scripts/serve.js` | A small local server for previewing |
| `scripts/check-all.js` | Every check in one go: `node scripts/check-all.js` |
| `scripts/check-session.js` | Checks the session file and every page the way the browser reads them |
| `scripts/test-stage-timer.js`, `scripts/test-oracle.js` | Tests for the timers and for how the Oracle reads a question |
| `.githooks/` | Run the checks, and keep credentials out, on every commit and push. Turn on once per clone: `git config core.hooksPath .githooks` |
| `.github/workflows/checks.yml` | GitHub Actions runs the same checks on every pull request |

## Run your own session

Two ways. **Without any code:** run it from the live site as it is. Make your own Google Meet and your own copies of two Google files (the Breakout Planner and the walls deck), paste their links in the chat, and present from the stage; the Hosts page walks through all of it. **With your own copy of the site,** so the clock, the links, and the names on every page are yours, at your own web address:

1. Make a free GitHub account if you don't have one. On this repository, press **Fork** (top right). In your copy, open **Settings**, then **Pages**, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and Save. Your site appears at `yourname.github.io/a-mn-hackathon` within a few minutes. (`.nojekyll` is already in the repo; leave it.)
2. First make your Google files: copy the Breakout Planner, the walls deck, the session slides, and the starter code deck (open each, then **File**, **Make a copy**), share the first two so anyone with the link can edit, and make your Meet.
3. In your copy, open `assets/session.js` and press the pencil icon to edit it in the browser. It's a text file of dates, times, names, and links, not a program: change only the text between quote marks. Set `day` (`"2026-11-12"`), `start` and `end` (`"15:30"`, `"17:30"`, 24-hour), and `timeZone` (`"America/Chicago"`). Put your links under `links`: `meet` (your Google Meet), `planner` (your Breakout Planner), `gallery`, `wonder`, and `worry` (three slides in your walls deck; open the slide and copy the address), `backup` (your copy of the session slides), `companion` (your copy of the starter code deck), `repo` (your copy on GitHub). Set `url` to your site's address without `https://` (`"yourname.github.io/a-mn-hackathon"`); `title`, `subtitle`, and `org` (your host; the partner credit on every page); and `next` (what your group does next, or empty, and the close says only thank you). Leave `record` as the first run's, or clear it. `docs/SESSION-KIT.md` explains every field, each part's length, the presenter's screens and notes, and what `{braces}` can say. If a page goes blank after you save, a quote mark or a comma is missing: undo the last change.
4. The marks and names: `assets/mngaia-mark.png` is the partner credit, replace it with your host's; `maker` and the mark in `assets/brand/` are the kit's signature at the lower left. The license (CC BY-NC-SA 4.0) asks you to keep a credit to the original, so leave the signature, or set `maker` to "Your Name, adapted from First Builds by Sean Beaverson". The colors are named once, as roles, at the top of `assets/site.css` and `assets/present.css`; point them at your palette or leave them.
5. The invitation on Home before the day (the lede under the title, and "Before you come") is written in `index.html`; change its words to yours. The Starters and Grant a wish pages need nothing changed.
6. Optional checks, for anyone with git and Node.js on their computer: turn on the hooks (`git config core.hooksPath .githooks`) and run `node scripts/check-all.js`. It tells you about a link the pages name that the session file doesn't have, a brace that nothing fills, a typed site address in a message, and parts that don't add up to the advertised length. Preview with `node scripts/serve.js`, and walk the session with `?now=10:50` on the end of any page's address (that time, on your `day`, in your `timeZone`). If you edit on github.com instead, skip this step and open your live site: check every link and the time on each page yourself.
7. Open your site's Hosts page: it now shows your links, and its run of show is yours.

**To add a starter:** put one self-contained HTML file in `cabinets/` (styles and scripts inline, made-up data only, so it pastes whole into an AI tool), add it to the `MACHINES` list at the top of `assets/site.js`, and add its card to `starters.html`. Level 3 scripts go in `recipes/` and the `SCRIPTS` list, with their steps in `SCRIPT_STEPS`.

**To add a source:** add one entry to `assets/sources-data.js`. The Sources page's tabs, filters, search, and start-here paths pick it up.

## Docs

- [Handoff](docs/HANDOFF.md): decisions, what exists, what's left, and a starter prompt for a new chat or another computer
- [The session kit](docs/SESSION-KIT.md): how the session file works, and how to run a new session
- [Accessibility](docs/ACCESSIBILITY.md): what was checked, what was fixed, what still needs a person
- [Decisions](docs/DECISIONS.md): one line for each consequential decision, with the date and the reason
- [CLAUDE.md](CLAUDE.md): the rules an AI assistant (or a new colleague) follows when changing the site

## Preview it

From this folder, on Windows or Mac:

```bash
node scripts/serve.js
```

Then open http://localhost:4178. Add `?now=10:50` to any page's address to see it as it will look at that moment on Friday.

## Presenting

Open Present on the computer that shares its screen in Meet. Arrow keys move through the screens; F is full screen; N jumps to the part that's on now; S opens the speaker notes in a second window, which follows the stage and can drive it.

The opening screen shows the two hours with **Call to order** (or T), beside **Pause** (or P) and **Reset**. Called to order, the clock counts down and moves into the corner on the next screen; click it or press C to show it large on frosted glass, with wait-time countdowns (a running wait stays visible in the corner too), and Esc to put it back. Screens with their own timer (Show & Tell, the breakout rooms, Show & Cheer, the close) start and pause with T, and + and − add or take away a minute without stopping it. **Open the site** in the controls leaves full screen and opens the site in a new tab.

## Accessibility and privacy

The target is WCAG 2.1 AA, with the WCAG 2.2 focus-not-hidden and target-size items, in light and dark themes and at 320px wide. [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) says what was checked, what was fixed, and what still needs a person with a screen reader. The site sets no cookies, loads no analytics, and sends nothing anywhere; the Copy buttons use the clipboard and nothing else. The starters use made-up names and made-up data, and ask you to do the same.

## License

Two licenses. The code (the HTML, CSS, and JavaScript, the starters, and the Apps Scripts) is [MIT](LICENSE). The words, pages, and slides are [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) by s.beaverson: share and adapt them with credit, not commercially, under the same license. Two sets of marks are excepted from both: the MNGAIA mark belongs to MNGAIA · AI4MN and is used with permission, and Sean Beaverson's mark in `assets/brand/` is his. Replace both with your own when you reuse the kit. The icons in `assets/icons.js` are Lucide's, under the ISC license.
