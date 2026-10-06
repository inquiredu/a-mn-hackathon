# Hands On: A Friday Hackathon

This page is the whole Friday session, October 9, 10:00 to noon Central, hosted by MNGAIA · AI4MN. Everyone gets the one link. It holds the plan for the morning, the Remix Arcade, the path for building a wish from scratch, the gallery wall, Show & Cheer, and the close. A bar at the top follows the clock on Friday, so anyone who arrives late can see what's happening and jump in.

It will live at inquiredu.org/a-mn-hackathon, next to What We Talk About.

## How Friday fits together

| Time | Where | What happens |
| --- | --- | --- |
| 10:00 | Main room | Welcome. Wishes go in the Meet chat: "I wish I had a thing that..." |
| 10:08 | Main room | One wish is built live, broken on purpose, and fixed. |
| 10:20 | Breakout rooms | The Remix Arcade: play a machine, hand it to your AI, remix it. |
| 10:45 | Same rooms | Grant a wish: build something from scratch. |
| 11:20 | Main room | Show & Cheer, drawn from the gallery wall. |
| 11:42 | Main room | The close: one wonder, one worry, one word. Done by 11:55. |

One host stays in the main room the whole time, building wishes live for latecomers and anyone who'd rather watch.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The page. The Today list's times also drive the "Now" bar. |
| `assets/site.css` | The look, taken from the MNGAIA mark |
| `assets/site.js` | The "Now" bar, the copy buttons, and the machine room |
| `assets/mngaia-mark.png` | The hexagon mark, cut from the MNGAIA banner |
| `cabinets/oracle.html` | The Teacher's Lounge Oracle (working) |
| `scripts/serve.js` | A small local server for previewing |

The Soundboard, Catch!, and the Slider Lab are placeholders.

Each machine is a single HTML file with nothing outside it, so it pastes cleanly into any AI tool. The settings worth changing sit at the very top of each file, so a first-timer who opens the code sees them first.

## Before Friday

- Make the gallery slide and the wonder/worry slide, and paste their links into `LINKS` at the top of `assets/site.js`.
- Paste the Oracle into Gemini on a district Google account with Canvas on. Does it run, and does the gong play? Then the same in Claude and ChatGPT.
- Try the Copy buttons from the live link on a Chromebook, a district laptop, and Safari.

## Preview it

From this folder, on Windows or Mac:

```bash
node scripts/serve.js
```

Then open http://localhost:4178. Add `?now=10:50` to the address to see the page as it will look at any moment on Friday.
