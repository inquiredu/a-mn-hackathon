# Content pass: First Builds for someone who wasn't there

The plan for the next phase of work, written October 11, 2026, so a fresh chat can start cold. Read `CLAUDE.md`, then `docs/HANDOFF.md`, then this.

## The goal

First Builds ran once, live, as Hands On (October 9, 2026). From now on, almost everyone who opens it will find it cold: no Meet, no co-host, no breakout room, no one to ask. Walk the site page by page, find every place where such a person would stall, misread, or need something the page doesn't give them, and rewrite until each page is the best content it can be. Instructions get the most care: anyone, including someone who has never coded, should be able to tell what each thing is, where it runs, and what to do, without help.

This pass is about content: words, instructions, order, labels, and what each page contains. Visual and between-page design polish comes after, in its own pass, once every page's content is settled.

## Where things stand

- **EXISTS** on the local branch `north-shore-look`, ahead of `origin/main` (`git log origin/main..` lists the commits), **not pushed** (the repo is public, so pushing publishes it; Sean decides): the North Shore look, the front door for anyone, the rename to First Builds, the signature (mark, "s.beaverson", CC BY-NC-SA 4.0) at the lower left, MNGAIA · AI4MN leading the credits. `docs/DECISIONS.md` has every October 11 decision with its reason.
- **EXISTS**: the live site at inquiredu.org/a-mn-hackathon still shows the old MNGAIA look. Nothing on this branch is live.
- Preview: `node scripts/serve.js`, then http://localhost:4178. With no `?now=`, every page is in its after-the-event state, which is what a newcomer sees. Add `?now=10:50` only to check the event-day states still work.

## The reader

Write for one person first: **an educator who finds the link cold.** A teacher, coach, or school leader, sent the link by a colleague or finding it in a search. They weren't at the session. They have a school Google account and maybe Gemini; maybe Claude or ChatGPT. They may be on a district laptop where some sites are blocked. They have never written code and may not know what Apps Script, an embed, Canvas, or an artifact is. They have twenty minutes and some curiosity.

Second reader: **someone who wants to run the session with their own team.** They need the Hosts page and the kit, framed as "how to run your own," not as a record of how Sean's co-hosts ran it on October 9.

## The bar every instruction has to clear

These are the acceptance criteria for this pass. A page is done when every instruction on it meets all of them.

1. **Say what it is before what to do.** Each thing names its kind before its steps: a tool you play in the browser, a prompt you paste into an AI chat, a page you put on your Google Site, or a script that runs in your Google Drive. Say where it runs, what it needs, what it makes, and about how long it takes.
2. **One destination per thing, and say which.** If something goes into an AI chat, say so. If it goes into Apps Script, say so, and never set it beside a paste-into-your-AI button without saying what each one is for.
3. **Name every place.** Every step names where you are (a web address, or the app and its menu path) and what you'll see there. "Paste it into a new project" is not a step; "Go to script.google.com, choose New project, delete what's there, and paste" is.
4. **Prerequisites first.** Anything you need before step 1 (a folder, a Sheet with names in column A, a template Doc, a Google Site you can edit) is listed before step 1, with a made-up example where one helps.
5. **No unexplained words.** Define or replace on first use: Canvas, artifact, Preview, embed code, Apps Script, project, ID (and where to find one), Run, the permission screen, the Execution log, remix, starter, level.
6. **Show the end.** Say what you'll see when it worked ("A new Sheet named Drive Inventory appears in your Drive with one row per file").
7. **Show breaking.** Name the likely failure and the fix: the permission screen warns that the app isn't verified; Gemini shows code instead of running it; Google Sites refuses the embed; the copy button is blocked.
8. **Nothing depends on the day.** No breakout rooms, Teams doc, co-hosts, "today", "on the day", or "come find one of us", unless it's framed for someone running the session with a group.
9. **Safe by default.** Made-up names and data in every example. Say what a permission screen is asking for and why. Nothing about students goes into an AI or a script you can't yet explain.
10. **One way to do one thing.** When two pages describe the same task, they say it the same way, ideally from one source (see the script steps below).

## The known confusion, and its causes

On the day, people who tried a level 3 script thought it was meant to be pasted into Gemini. They didn't know it was a bounded script that runs in Apps Script against a folder or a spreadsheet. Causes found on October 11:

- **It looks like a starter.** The two scripts sit on the Starters page in the same card as the chat starters (`starters.html`, "Level 3 · Behind the scenes"), with the same kind of buttons. The card pattern teaches "copy, then paste into your AI."
- **The buttons sit side by side.** *Copy the script* and *Copy for my AI* are next to each other, and nothing on the card says the first goes into Apps Script and the second goes into a chat only to have the script explained.
- **The card's steps leave out the place.** "Paste the script into a new project" never says where. script.google.com appears once, in the section's opening line, not in the steps.
- **The setup is missing.** The Drive Inventory needs a folder and its ID. The Doc Multiplier needs a template Doc and a Sheet of names, with their IDs. Neither card says to make those first, or what an ID is or where to find it.
- **Unexplained words.** "Choose inventory" (the function menu in the Apps Script toolbar), "the permission screen", and "the Execution log" aren't explained on the card.
- **The two pages disagree.** `levels.html` (level 3) says it more fully ("Go to script.google.com and choose New project. Delete what's there and paste the script.") than the Starters card. A reader who lands on Starters first gets the thin version.

The fix should cover the card's kind, its prerequisites, the place, the words, and the end state, and give one set of steps both pages use.

## Candidates to check, page by page

These are hypotheses from a first read on October 11, not findings. Confirm or drop each one with the cold-reader method below, and add what it finds.

**Home** (`index.html`, after state)
- The front door was rewritten on October 11. Check that a cold reader can say what First Builds is and where to start within ten seconds.
- "Show one person" asks the reader to have built something already; check the order.
- Footer: "Nothing about real students goes into an AI today" and "Site blocked? The same morning as slides" are tied to the day.

**Three levels** (`levels.html`)
- "On the day: watch all three happen live" and "Live on the day" labels describe a demo the reader can't see.
- Level 1: "choose Canvas first", "switch on Preview": does the reader know what those are and where they are?
- Level 2: assumes a Google Site the reader can edit, and Embed code. The unverified limits are recorded in `HANDOFF.md`: does Sites cap the length of pasted code, and does its sandbox break anything?
- Level 3: the clearest script steps on the site. Still check IDs, the permission screen's "unverified app" warning, and where the result appears.
- "Pick your level" sends people to the Teams doc. Level 4 says "Not for today… come find one of us."

**Starters** (`starters.html`)
- "First, find your room. Open the Teams doc" is the first thing on the page.
- The script cards (above).
- Level 1: what *Play* does compared with *Copy for my AI*; what the next-step panel tells you; that the remix menu only works after the starter is already in a chat.
- Level 2 (Charter Cards, Syllabus Page): "paste the code into a Google Site" depends on the same Embed path as `levels.html`; check that they match.
- "Where do I paste it?" is folded at the bottom, after the reader needed it.

**Grant a wish** (`wish.html`)
- "Ask for help. In your breakout room, press Meet's Ask for help button."
- "Pin it to the gallery wall" invites anyone to edit a past event's slide deck that anyone with the link can edit, and the link is in a public repo. Decide whether newcomers should be sent there at all (see Decisions).
- The wish builder and the wish jar: is it clear the result is a prompt to paste into an AI chat?

**Sources** (`sources.html`)
- "How {weekday} is built on this" ties the research to the day.
- "Start here" paths and filters: check that a cold reader knows which path is theirs.
- "Sources checked October 7, 2026": keep the date (it's honest), but say what to do when a help page has changed.

**Hosts** (`hosts.html`)
- It's written for the day's co-hosts ("For hosts, co-hosts, and anchors", the Teams doc, latecomers). For a reader who wants to run their own session, it needs a frame: what you need, how to copy the kit (the README's "Run your own session"), and what to change in the session file.
- The materials row links to the event's own Meet, Teams doc, and walls.

**Present and speaker notes** (`present.html`, `notes.html`)
- *Present* is a pill in every page's menu. A cold reader who clicks it lands on a full-screen stage with a session clock. Decide whether it stays in the main menu, moves to Hosts, or carries a line saying what it is.

**The starters themselves** (`cabinets/`) and **the scripts** (`recipes/`)
- Only where an instruction inside one confuses: for example, a starter's own help text, or the comments at the top of a script that say what to change.

## Decisions for Sean, early

Surface these in the audit report, before rewriting, because they change what several pages say:

1. **The event's shared links.** Meet, the Teams doc, the walls deck (gallery, wonder, worry): keep them for the record, remove them from newcomer paths, or retire them. `HANDOFF.md` already says to set the Teams doc and walls deck to view-only, since their links are public.
2. **Present in the menu.** Does it stay where every visitor sees it?
3. **Hosts: a record or a guide?** Is the page the record of how October 9 ran, a guide to running your own, or both, with the record folded away?
4. **Starters vs. Three levels.** Should the two scripts move to Three levels only (Starters stays "things you can play"), or stay on Starters as a different kind of card?
5. **Pushing the branch** and opening a pull request.

## How to work

1. **Audit first, all pages, before rewriting any.** For each page, run a cold reader: an independent subagent that gets only the persona above and the page's rendered text (from the browser, after `site.js` fills it). It doesn't get this plan or the repo, so it reads as the newcomer does. Ask it to list every place it would stall, misread, or need something not on the page, and to try to say, for each button, what will happen when it's pressed. Then follow each instruction yourself in the browser where you can (Play, Copy, the next-step panel, the embed and script steps up to the point they leave the site).
2. **Write the audit** into a new `docs/CONTENT-AUDIT.md`: for each page, each finding as *what confuses · where (file:line) · why · proposed fix*, marked against the bar above, plus the decisions Sean needs to make.
3. 🛑 **Stop and report.** Sean reviews the audit and makes the decisions before any rewriting.
4. **Rewrite page by page,** in the order Home, Three levels, Starters, Grant a wish, Sources, Hosts, then Present and notes, then the footer. After each page, re-run the cold reader on the new version. It should be able to say what every thing is and complete every task without outside help. Commit each page on its own, with a line in `docs/DECISIONS.md` for any decision.
5. 🛑 **Stop after all pages** for Sean's read-through, before the design pass.

## Rules that still apply

From `CLAUDE.md`, and they matter more here because copy is moving:
- **One source.** Times, links, names, stage screens, notes, and chat messages live in `assets/session.js`. Reach them with `link-slot`, `{braces}` inside `data-fill`, or `{links.name}`. A link or a time typed into a page is a second copy that will drift. Script steps used on two pages should come from one place too, either a shared block that `site.js` fills or a single page that the other links to.
- **Lengths, not clock times.** Only the advertised `{start}` and `{end}` appear as times.
- **Made-up data only.** In starters, examples, prompts, and screenshots.
- **Voice.** Plain, warm, exact (`/Users/sbeaverson/Documents/VIBECODE/_context/voice.md`). Begin in the substance. "We" before "I". AI suggests, a person decides.
- **Look.** North Shore, as built. Don't change colors, type, or layout in this pass beyond what new content needs; note design ideas for the next pass instead.
- **Credits.** MNGAIA · AI4MN lead ("Prepared for and presented with"). Sean's identity appears only at the lower left: his mark, "s.beaverson", and CC BY-NC-SA 4.0. No "Made by" anywhere else.
- **Accessibility.** WCAG 2.1 AA, checked at 375px wide in light and dark. New instructions need real headings, ordered lists for steps, and link text that says where it goes.

## Done means, for this pass

- Every page's instructions meet the bar above, and the cold reader, run on the final version, finds nothing that needs outside knowledge.
- No page depends on the day, except where it's framed for someone running the session with a group.
- The script confusion can't happen: the kind, the place, the prerequisites, and the end state are on the card and in the steps, the same on every page that has them.
- `node scripts/check-all.js` passes, and `scripts/check-session.js` knows any new brace.
- Each page has been seen at 375px and at desktop width, in light and dark, with no contrast failures.
- `docs/HANDOFF.md` and `docs/DECISIONS.md` are updated; `docs/CONTENT-AUDIT.md` holds the findings and what became of each.

## Working notes

- **iCloud is slow in this folder.** On October 11, reads stalled for a minute or more, `git commit` took over ten minutes because the pre-commit hook copies every staged file, and one edit hung partway through. Give commands long timeouts. If something stalls, run `brctl download .` (and `brctl download .git`) from the repo before deciding it's broken. Never kill an edit midway; let it finish, then check the file.
- **Git identity.** Global git config sets `useConfigOnly` with no identity. Commit with `git -c user.name="Sean Beaverson" -c user.email="192934662+inquiredu@users.noreply.github.com" commit …`. New commits, not amends.
- **The stage and notes talk over a BroadcastChannel.** Another chat with the notes open on localhost:4178 can move your stage. Test the stage in one window.
- **Contrast check.** The October 11 pass measured every visible line of text against its real background in a hidden iframe per page. Rerun something like it after copy changes; it doesn't cover the cue, toasts, dialogs, open menus, or hover states.

## Starter prompt for the fresh chat

> We're continuing First Builds (first run as Hands On) in `~/Documents/VIBECODE/a-mn-hackathon`, on the local branch `north-shore-look`. Read `CLAUDE.md`, then `docs/HANDOFF.md`, then `docs/CONTENT-PASS.md`, which is the plan for this chat: a page-by-page content audit for someone who wasn't at the event, with the clearest possible instructions. Start with the audit only, using a cold-reader subagent that sees just the persona and each page's rendered text, and write it to `docs/CONTENT-AUDIT.md`. Stop there and report before rewriting anything. Don't push or publish without asking me.
