# Hands On: A Friday Hackathon

A one-link site for a two-hour virtual hackathon hosted by MNGAIA · AI4MN on Friday, October 9, 2026, 10:00 to noon Central. Educators build small tools with AI that are worth opening on Monday, in teams of four, and show one person what they made. It lives at inquiredu.org/a-mn-hackathon.

## The pages

| Page | For | What it does |
| --- | --- | --- |
| [Home](index.html) | Everyone | Changes with the clock: the invitation before, "Happening now" during, a keepsake after |
| [Starters](starters.html) | Builders | Five starters that already work, to play, copy into an AI tool, and remix |
| [Grant a wish](wish.html) | Builders | Build something from nothing: a wish builder, a jar of wishes, three moves for when you're stuck |
| [Hosts](hosts.html) | Hosts and anchors | Forming teams, a room calculator, the run of show, before, during, and after |
| [Sources](sources.html) | Anyone curious | How-tos, cautions, and research on learning to code |
| [Present](present.html) | The presenter | The main-room stage; press S for speaker notes in a second window |

## How it's built

Everything about the morning lives in one session file, `assets/session.js`: the times, the links, the presenter's screens and notes, the hosts' checklists, and ready-to-paste messages. Every page reads it. Plain HTML, CSS, and JavaScript, with no build step and no tracking.

| Path | What it is |
| --- | --- |
| `assets/session.js` | The session file |
| `assets/site.js`, `assets/site.css` | The participant pages and the Hosts page |
| `assets/hosts.js` | The run of show and the room calculator |
| `assets/sources-data.js`, `assets/sources.js` | The sources as data (add one entry to add a source), and the page that filters them |
| `assets/present.js`, `assets/present.css`, `notes.html` | The stage and the speaker notes |
| `cabinets/` | The starters, each a single HTML file that pastes cleanly into any AI tool |
| `scripts/serve.js` | A small local server for previewing |

## Docs

- [Handoff](docs/HANDOFF.md): decisions, what exists, what's left, and a starter prompt for a new chat or another computer
- [The session kit](docs/SESSION-KIT.md): how the session file works, and how to run a new session
- [Accessibility](docs/ACCESSIBILITY.md): what was checked, what was fixed, what still needs a person

## Preview it

From this folder, on Windows or Mac:

```bash
node scripts/serve.js
```

Then open http://localhost:4178. Add `?now=10:50` to any page's address to see it as it will look at that moment on Friday.
