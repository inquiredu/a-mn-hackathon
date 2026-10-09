# Hands On: A Friday Hackathon

A one-link site for a two-hour virtual hackathon hosted by MNGAIA · AI4MN on Friday, October 9, 2026, 10:00 to noon Central. Educators build small tools with AI that are worth opening on Monday, in teams of four, and show one person what they made. It lives at [inquiredu.org/a-mn-hackathon](https://inquiredu.org/a-mn-hackathon).

**Status:** ran on October 9, 2026, and kept here as a session kit. Plain HTML, CSS, and JavaScript. No build step, no dependencies, no tracking, no analytics, no cookies. MIT licensed: fork it and run your own.

## The pages

| Page | For | What it does |
| --- | --- | --- |
| [Home](index.html) | Everyone | Changes with the clock: the invitation before, "Happening now" during, a keepsake after |
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

1. Fork the repo and turn on GitHub Pages for `main`. Add an empty `.nojekyll` if yours lacks one (this repo has it).
2. Edit `assets/session.js`: the date, the start and end, each part's length, the links to your own Meet, team doc, and decks, and the presenter's screens and notes. `docs/SESSION-KIT.md` explains every field and what `{braces}` can say. Every page, the stage, and the notes read from this one file.
3. Replace `assets/mngaia-mark.png` with your own mark, and the colors at the top of `assets/site.css` and `assets/present.css` with yours.
4. Turn on the hooks (`git config core.hooksPath .githooks`) and run `node scripts/check-all.js`. It tells you about a link the pages name that the session file doesn't have, a brace that nothing fills, and parts that don't add up to the advertised length.
5. Preview with `node scripts/serve.js`, and walk the morning with `?now=10:50` on any page.

**To add a starter:** put one self-contained HTML file in `cabinets/` (styles and scripts inline, made-up data only, so it pastes whole into an AI tool), add it to the `MACHINES` list at the top of `assets/site.js`, and add its card to `starters.html`. Level 3 scripts go in `recipes/` and the `SCRIPTS` list instead.

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

[MIT](LICENSE). The MNGAIA mark belongs to MNGAIA · AI4MN and is used with permission; replace it with your own when you reuse the kit.
