# Design review brief

You are a senior product designer reviewing one part of a small website and the slideshow that goes with it. You see only the screenshots and facts in your packet. You have not seen the code and you should not look for it: open only the files your packet lists.

## The bar

The owner's words: "an elegant and easy to use experience. All design choices should be intentional. Smooth interaction, clear intention: no portion of any page is simply allowed to be. It is designed for maximum experience."

So review every region of every screen. For each one, ask: what is it for, does its design say so at a glance, does it earn its place, and is it the best version of itself? Nothing gets a pass for being there already.

## What the site is

**First Builds**: small tools that K-12 educators (teachers, coaches, principals, district staff) build with an AI chat (Gemini, ChatGPT, Claude), plus a kit for running a two-hour virtual hackathon on Google Meet. Most visitors have never coded. They arrive from a link someone sent, often on a school Chromebook or a phone, sometimes on a locked-down district laptop. It was first run live on October 9, 2026 for a partner organization (MNGAIA · AI4MN); now it is a standing kit for anyone, any day.

Surfaces:
- **Home**: changes with the clock. Before the event, an invitation; during, "Happening now" and the plan; after (any day since), a front door for anyone.
- **Three levels**: three ways to start with code: in the chat (a tool runs inside the AI chat), on your site (a page pasted into a Google Site), behind the scenes (a short Google Apps Script). Steps, prompts, a script.
- **Starters**: eight small working tools. Play one in a window, copy it into your AI chat with one button, then remix it with suggested changes.
- **Invent your own**: build something new: a three-question builder turns answers into a request to paste into the AI; a jar of ready ideas that fill the builder; what to do when stuck; how to share your work on a shared slide deck (the gallery wall).
- **Hosts**: a guide for whoever runs the session with their own group: roles, setup before the day, the run of show with checklists and ready-to-paste chat messages, what to do when things break, a record of the first run.
- **Sources**: 45 checked links: AI tool help pages, student data and safety cautions, research on learning to code. Paths, tabs, filters, search.
- **The stage** (`present.html`): a full-screen slideshow the presenter shares in Google Meet (as a browser tab, so usually seen at about 1280×720, often smaller in participants' video windows). Navy, one idea per screen, a session clock, live timers. The presenter's controls (top right, and the buttons of the timers and the clock) appear only when the presenter moves the mouse or presses a key, and fade after a few seconds, so the room sees only the screen and the clock; screenshots labeled "presenter view" show them.
- **Speaker notes** (`notes.html`): a small second window (opened at 560×780) beside the stage; it follows the stage, drives it, and mirrors its timer. It follows the site's Night theme.
- **The Play window and the six starters**: a dialog on Starters that runs a starter in a frame; each starter is also a single HTML file people paste into their AI, so it must look good on its own, in an AI tool's preview panel, and on a Google Site.

## Fixed: don't propose changing these

- **The brand: North Shore.** Cream pages (#F4F1EB), Beaver navy (#20384F and its scale) for text and primary actions, Sun copper (#C47D4D) as the one warm accent per view (copper text uses the dark copper #8A522C), Water slate-teal (#608C9B) as a secondary accent. Montserrat for headings, labels, and anything you press; Newsreader (a serif) for reading text; IBM Plex Mono for code. Wide-tracked uppercase eyebrow labels. No gradients, no textures, no emoji (the four-point star ✦ is the brand's one ornament). Hairlines before shadows; shadows for overlays and hover lift. Radii: 4px buttons and inputs, 8px cards, 14px dialogs, pills for tags. Motion: quiet, 120–360ms, ease-out, fades and short slides, no bounce; clickable cards may lift 2px. The site's dark theme ("Night") is drawn from the same scales: navy pages, cream text. The stage is navy with cream type and copper accent words. You may propose how these are *used* (which token where, hierarchy, emphasis, spacing), not new colors or typefaces.
- **The credits.** The partner (MNGAIA · AI4MN, with its own mark in its own colors, beside its name, with no label phrase) leads. The author signs only at the lower left of each page and the stage: his small beaver mark, "s.beaverson", and the license (CC BY-NC-SA 4.0). Don't add or move credits.
- **Accessibility: WCAG 2.1 AA**, checked at 375px wide, in light and dark. The focus ring is a 2px copper outline offset 3px. Target sizes should meet WCAG 2.2's 24px minimum.
- **Plain HTML, CSS, and JavaScript**, no build step, no frameworks, no outside libraries. Proposals must be buildable that way.
- **The words** were rewritten last week in a separate content pass; wording is not your subject. How text is *structured* is: if a block is too long or too dense to read where it sits, or its hierarchy is flat, say so and propose the structure (steps, a list, a summary line with detail folded, a split). Labels on buttons and links are design too: flag one that doesn't say what pressing it does.
- **Made-up data** in every example.

Everything else is open: layout, hierarchy, navigation, component design, spacing, alignment, density, states (hover, focus, pressed, selected, disabled, empty, loading, done), transitions, phone layouts, what's shown when, and whether a region should exist at all.

## How to look

1. Read the packet's list first so you know what each image shows (surface, state, width, theme). Then view every image it lists. Phone screenshots are at 2x pixel density; desktop at 1x.
2. Go down each surface region by region (header, now bar, hero, each section, each card type, the footer, overlays). For each region, note what it's for and what's wrong, if anything.
3. Then judge the whole: where does the eye land first, second, third, and is that the order that serves the visitor? Is there one clear primary action per view? Is the spacing rhythm consistent? Do things align to a grid? Is the type scale used consistently, with each level meaning one thing? Is copper used as one highlight, or sprinkled? Does what looks clickable click, and does what clicks look clickable? Does the phone layout feel designed for the phone or merely squeezed? What would a first-time visitor misread?
4. Be concrete. "Spacing feels off" is not a finding; "the gap above 'The morning' (≈96px) is double the gap above 'Before you come' (≈48px), so the two sections don't read as siblings" is.

## Severity

- **Break**: something fails: a task can't be completed or is likely to go wrong, an affordance misleads, text is unreadable or clipped, things overlap, layout breaks, an AA failure.
- **Friction**: it works but costs effort, confidence, or time: unclear primary action, weak or wrong hierarchy, a dense block that won't be read, an inconsistent pattern, cramped or ambiguous controls.
- **Polish**: it's close but doesn't yet look intended: spacing rhythm, alignment, type detail, a missing hover or transition, an orphaned element.

## What to write

Write your review to the file path your task names, in Markdown, in this shape:

```
# <Surface> · design review

## The five that matter most
1. ... (one or two sentences each, with the finding ID)

## Findings
| ID | Sev | Where | What I see | Why it matters | Proposed fix |
|---|---|---|---|---|---|
| H1 | Break | after-375-light s03, the "Everything here" cards | ... | ... | ... |

## Region by region
- **Header**: ...
- ...

## Keep
- What already works and must survive a redesign (short).

## Questions for the owner
- Only decisions you can't make from the screenshots (short; may be empty).
```

Use the ID prefix your task gives. "Where" names the image file (or files) and the region, so someone can find it. Proposed fixes should be specific enough to build: name the element, the change, and the intended effect (sizes in px or rem where it matters). Mark a finding "(inferred)" when you can't see it directly, e.g. a hover state you're guessing at. Aim for completeness over brevity, but don't repeat yourself: one finding per problem, listing every place it occurs. When you're done, reply with only the path you wrote and your five most important findings, one line each.
