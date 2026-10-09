# The session kit

One file describes a whole session, and every view reads it. To run a new session, copy `assets/session.js`, change what's inside, and change the session-specific pages (Starters, Grant a wish) if the new session needs different ones.

## What reads the session file

| View | File | Uses |
| --- | --- | --- |
| Every page | `assets/timing.js` | Lays out the parts and fills in every time, date, and length |
| Participant pages | `index.html`, `starters.html`, `wish.html` with `assets/site.js` | The day, the parts of the morning, the links |
| Hosts page | `hosts.html` with `assets/hosts.js` | Everything, including checklists, messages, and speaker notes |
| Presenter view | `present.html` with `assets/present.js` | The screens |
| Speaker notes | `notes.html` | The screens and their notes |

## The session file, field by field

```js
const SESSION = {
  title, subtitle, org,             // names shown on pages and the stage
  day: "2026-10-09",                // clock-driven features run on this day
  timeZone: "America/Chicago",
  start: "10:00", end: "12:00",     // the advertised start and end, 24-hour
  dateLabel,                        // shown in the bar on other days, written with {braces}
  url: "inquiredu.org/a-mn-hackathon",
  links: { meet, teams, wonder, worry, backup, companion },  // leave one empty and the page says it's coming soon
  pace: { nudge: 10, ... },         // cues inside the parts, in minutes
  segments: [ ... ]                 // the parts of the session, in order
};
```

Each segment:

| Field | What it's for |
| --- | --- |
| `id` | A short name to use in braces: `{wish.end}` |
| `minutes` | How long it runs. The parts run end to end from `start`, so changing one moves every part after it |
| `title`, `where` | Its name, and "Main room" or "Breakout rooms" |
| `hint` | One line for participants |
| `link`, `linkLabel` | The page to send people to, and the button's words |
| `shared` | Links from `links` this part uses, shown on its timeline row and its Happening now card: `[{ link: "teams", label: "Teams doc" }]` |
| `screens` | What the stage shows, in order |
| `host` | A checklist for hosts |
| `messages` | Ready-to-paste chat messages: `{ to, text }` |

## Times live only in the session file

The pages and the stage show each part's length ("35 min"), not its clock time; only the session's own `{start}` and `{end}` appear as times. Prefer lengths in new copy too: `{building}`, `{wish.length}`, "with {nudge} left".

No page or message types out a time, date, or length. Write it in braces instead, in any text in the session file or in a page element marked `data-fill`, and `assets/timing.js` fills it in:

| Write | Reads (for this session) | What it is |
| --- | --- | --- |
| `{start}`, `{end}` | 10:00, noon | The session's start and end |
| `{wish.start}`, `{wish.end}` | 10:45, 11:20 | When a part starts or ends, by its `id` |
| `{wish.end - nudge}` | 11:10 | A time moved by some minutes, or by a `pace` value |
| `{length}`, `{wish.length}` | two hours, 35 minutes | How long the session or a part runs |
| `{building}` | 60 minutes | All the time in breakout rooms |
| `{nudge}`, `{share}` | ten minutes, two or three minutes | A `pace` value (a pair like `[2, 3]` reads as a range) |
| `{weekday}`, `{date}`, `{zone}` | Friday, October 9, Central | From `day` and `timeZone` |
| `{parts}` | 6 | How many parts |
| `{title}`, `{subtitle}`, `{org}` | Hands On, ... | The session's names |
| `{links.teams}` | https://docs.google... | A link from `links`, for chat messages |

Add `:number` or `:unit` to split a length for big numerals (`{length:number}` is "2", `{length:unit}` is "hours"). Start with a capital letter to capitalize: `{Length}` reads "Two hours".

A mistyped name stays on the page in braces and shows an error in the browser console. Parts that run past `end` show a warning there too.

In a page, mark the element that holds the braces: `<p data-fill>Back at {wish.end}</p>`. The page's link preview text (`<title>` and the description) can't be filled in, because previews don't run the page's code, so keep times out of those.

## Kinds of screen

Every screen has a `kind` and an optional `note` (shown only in the speaker notes). Any screen can also have a `timer`: a `pace` name (`"showTurn"`, `"share"`) or a number of minutes. The stage then shows a countdown the presenter starts and stretches live: T starts or pauses it, + and - add or take away a minute without stopping it, and the speaker notes window has the same buttons. A length the presenter changes is remembered in that browser. The arithmetic lives in `assets/stage-timer.js`, tested by `node scripts/test-stage-timer.js`.

| Kind | Fields | Use it for |
| --- | --- | --- |
| `title` | `kicker`, `heading`, `sub` | Opening |
| `prompt` | `heading`, `big`, `body`, `url` (true shows the site address), `foot` | A question or call to action |
| `steps` | `heading`, `steps` (list), `foot` | Instructions before breakout rooms |
| `link` | `heading`, `body` | Putting the site address on screen |
| `embed` | `heading`, `src`, `caption` | Running something live on stage |
| `countdown` | `heading`, `until` (`"{wish.end}"`), `body` | Time left, for anyone watching in the main room |
| `awards` | `heading`, `awards` (`icon`, `name`, `why`) | Show & Cheer |
| `code` | `heading`, `code`, `caption` | Showing a few lines of code (braces here are left alone) |
| `quote` | `text` | One line, said and left to sit |
| `plan` | `heading`, `url` | The whole morning from `segments`: each part's time, name, and place |
| `pair` | `heading`, `cards` (`heading`, `body`), `foot` | Two side-by-side prompts |

To add a kind, add a function to `KINDS` in `assets/present.js` and its styles to `assets/present.css`.

## Keeping everyone in step

The clock keeps every view together: no server, no accounts, nothing to break. The trade-off is that if a session runs late, participants' "Now" moves on before the presenter does. A later version could let the presenter's Next move everyone's page through a small shared state, for example a Google Apps Script in the organization's own Workspace.

Add `?now=10:50` to any page's address to see it at that moment on the session day. The presenter view also takes `#5` to open at a given screen.
