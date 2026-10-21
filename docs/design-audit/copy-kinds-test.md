# Prompt or script? A cold-reader test of the copy labels

October 20, 2026. Sean's question: should every copy well on the site say what it holds and where it goes, and is that worth it? "Be critical of your answer and prove it."

## What happened on October 9

People in a level 3 room treated the Drive Inventory's script as a prompt. Nothing near "Copy the script" said which it was, and every copy on level 1 opened a sheet that said "Now paste it into your AI chat". The habit pointed at the AI chat, and at the one moment the destination changed, the page said nothing.

## The mechanical count

`main` before this change: **0 of 7** copy wells said what they held or where it goes. "Copy the script" opened no sheet. "Copy for my AI" meant two different payloads (a prompt to run a tool, or a request to explain a script). The prompt that writes the Drive Inventory sat in a closed fold on Three levels; the Doc Multiplier had none.

After: every copy well starts with its line (Prompt, Script, or Message, and where it goes), and `scripts/check-session.js` fails a copy well without one. Every copy that goes somewhere other than the AI chat says where in the sheet that follows it.

What was left alone, on purpose: the six "Copy for my AI" buttons on level 1 and 2 cards (the label names the destination, and the sheet after it says so again), the Remix menus' Copy buttons (the menu is the context, and a hint says "the same chat"), and Hosts' messages, which already open with "To:". A label on those would add a line to read without telling anyone anything new.

## The readers

Four independent readers, each given only a persona, seven screenshots of one version, and nine questions. None knew there was another version. Two personas: a teacher who has used ChatGPT a few times and never coded; an instructional coach who uses Gemini daily and has never opened Apps Script. Each was asked to glance once at each screen, the way a busy person reads in a breakout room, and to answer "not sure" when the screen didn't say.

The screens, captured the same way from both versions (headless Chrome, 1280 wide, Night): Starters' level 3 as it comes into view, the Drive Inventory card, its steps, the moment after pressing "Copy the script", Three levels' script and its prompt, and level 1's "Copy for my AI" as a control.

| | Before (`main`), 2 readers | After (this branch), 2 readers |
| --- | --- | --- |
| What "Copy the script" copies, and where it goes | 2 of 2 right | 2 of 2 right |
| What the second button copies, and where | 2 of 2 right | 2 of 2 right |
| The prompt: what it is, what comes back, where that goes | 2 of 2 right | 2 of 2 right |
| Control: level 1's "Copy for my AI" | 2 of 2 right | 2 of 2 right |
| After pressing "Copy the script", what the page says to do | **0 of 2**: "nothing", "only says Copied" | **2 of 2** quoted it: "Now paste it into Apps Script, not your AI chat" |
| Where their right answer came from | Reading ahead to step 2: "only because I read on", "only because I can still see step 2" | The label and the sheet at the moment of copying |
| Named, unprompted, the habit from level 1 as the likeliest way in to the wrong place | 2 of 2 | 0 of 2 |
| Confidence, 1 to 5 | 4, 4 | 4, 4 |

## What it shows, and what it doesn't

Careful readers find the right answer on both versions, so the multiple-choice questions don't separate them: that's a ceiling, not a tie. What separates them is where the answer comes from. On `main` it came from reading ahead, and both readers, independently, described the October 9 failure as the one waiting to happen. On the branch it comes from the screen at each moment, including the moment after copying, which is when people act on habit.

The limits: four simulated readers are not forty participants. They read more carefully than a room with a timer running, so they understate confusion on both versions. The real test is the next session.

## What the readers of the new version found, and what changed

- **Two buttons side by side that both copy the script** (both readers): someone in a hurry could paste the request to explain into Apps Script. "Copy for my AI to explain" now stands apart from "Copy the script", smaller, with a sentence that says it goes into the AI chat. "If it breaks" now says what a syntax error on line 1 means (words where code goes) and what to do.
- **How to take the code out of an AI's answer** (one reader): the prompt's note now says to copy only the code, which comes in its own box with a copy button.
- **The tabs**: a reader worried they might paste the prompt into Apps Script after switching tabs. The well's first line changes with the tab (SCRIPT or PROMPT), and the new "If it breaks" line covers it.

A reader of the old version also caught that Three levels called a script "a few instructions Google runs for you", which sounds like a prompt. It now says "a few lines of code".

## To run it again

The capture script and the readers' brief were scratch files; rebuild from this description. Serve `main` and the branch on two ports (`PORT=4179 node scripts/serve.js` in a second checkout), capture the same seven moments from each with `scripts/design-audit/cdp.js` (turn off smooth scrolling first: `document.documentElement.style.scrollBehavior = "auto"`, or the screenshots land mid-scroll), and give each reader one version's folder and nothing else.
