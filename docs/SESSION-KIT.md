# The session kit

One file describes a whole session, and every view reads it. To run a new session, copy `assets/session.js`, change what's inside, and change the session-specific pages (Starters, Grant a wish) if the new session needs different ones.

## What reads the session file

| View | File | Uses |
| --- | --- | --- |
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
  dateLabel,                        // shown in the bar on other days
  url: "inquiredu.org/a-mn-hackathon",
  links: { teams, gallery, wonder },  // leave one empty and the page says "link on Friday"
  segments: [ ... ]                 // the parts of the session, in order
};
```

Each segment:

| Field | What it's for |
| --- | --- |
| `start`, `end` | 24-hour times in the session's time zone |
| `title`, `where` | Its name, and "Main room" or "Breakout rooms" |
| `hint` | One line for participants |
| `link`, `linkLabel` | The page to send people to, and the button's words |
| `screens` | What the stage shows, in order |
| `host` | A checklist for hosts |
| `messages` | Ready-to-paste chat messages: `{ to, text }` |

## Kinds of screen

Every screen has a `kind` and an optional `note` (shown only in the speaker notes).

| Kind | Fields | Use it for |
| --- | --- | --- |
| `title` | `kicker`, `heading`, `sub` | Opening |
| `prompt` | `heading`, `big`, `body`, `url` (true shows the site address), `foot` | A question or call to action |
| `steps` | `heading`, `steps` (list), `foot` | Instructions before breakout rooms |
| `link` | `heading`, `body` | Putting the site address on screen |
| `embed` | `heading`, `src`, `caption` | Running something live on stage |
| `countdown` | `heading`, `until` ("11:20"), `body` | Time left, for anyone watching in the main room |
| `awards` | `heading`, `awards` (`icon`, `name`, `why`) | Show & Cheer |
| `code` | `heading`, `code`, `caption` | Showing a few lines of code |
| `quote` | `text` | One line, said and left to sit |
| `pair` | `heading`, `cards` (`heading`, `body`), `foot` | Two side-by-side prompts |

To add a kind, add a function to `KINDS` in `assets/present.js` and its styles to `assets/present.css`.

## Keeping everyone in step

The clock keeps every view together: no server, no accounts, nothing to break. The trade-off is that if a session runs late, participants' "Now" moves on before the presenter does. A later version could let the presenter's Next move everyone's page through a small shared state, for example a Google Apps Script in the organization's own Workspace.

Add `?now=10:50` to any page's address to see it at that moment on the session day. The presenter view also takes `#5` to open at a given screen.
