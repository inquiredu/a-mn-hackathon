// The session file. Everything about this session lives here:
// the participant page, the presenter view, and the host view all read it.
// To run a new session, copy this file and change what's inside.
//
// Times live only here. Anywhere in this file's text, or in a page element marked data-fill,
// write a time, date, or length in braces: {start}, {invent.end - nudge}, {Length}, {weekday}.
// assets/timing.js fills them in, and lists everything you can write.

const SESSION = {
  title: "First Builds",              // first run as Hands On, October 9, 2026
  subtitle: "A {weekday} Hackathon",
  org: "MNGAIA · AI4MN",            // the partner: "Prepared for and presented with {org}" on Home, every footer, and the stage
  maker: "s.beaverson",              // who made the kit: signed at the lower left of every page and the stage, with the license
  license: "CC BY-NC-SA 4.0",        // the words, pages, and slides; the code is MIT (see README). Its deed is links.license
  day: "2026-10-09",                 // the clock-driven parts only run on this day
  timeZone: "America/Chicago",
  start: "10:00",                    // when the session starts and ends, as advertised (24-hour)
  end: "12:00",
  dateLabel: "{weekday}, {date} · {start} to {end} {zone}",   // shown in the bar on other days
  url: "inquiredu.org/a-mn-hackathon",

  // Shared spaces and decks. A link shows on the site as soon as it's here. Leave one empty and the page says so
  // in its own words (a chat message says "(your planner link)"), so a host can run the session from this site
  // with their own Meet and their own copies of the Google files, pasting the links in the chat.
  links: {
    meet: "",                        // your Google Meet
    planner: "",                     // the Breakout Planner: a shared Google Doc with a list under each level, a Partner column, and a Room column
    // The walls: one Google Slides deck, one slide each, linked straight to the slide (the gallery is three slides in a row; link the first).
    // Share it so anyone with the link can edit, so people from every district can add to it.
    gallery: "",
    wonder: "",
    worry: "",
    // Backups for when this site is blocked. To run your own session from them, open each and choose File > Make a copy.
    // Session slides: the whole morning, screen by screen (Drive title "Hands On 10.9 · Session slides (backup)").
    backup: "https://docs.google.com/presentation/d/18BmKOht78NXQ2H3AvPgt3uLm9zQGRsD03dB2EBBd020/edit",
    // Starter code: every starter's code and remix menu, in the speaker notes (Drive title "Hands On 10.9 · Starter code (backup)").
    companion: "https://docs.google.com/presentation/d/1L3rwzGa4nrh1HDlExkhGetHYmQeqq_-cMcc8mmovtDM/edit",
    // The site's own code, public: how a session like this is built.
    repo: "https://github.com/inquiredu/a-mn-hackathon",
    // The license for the words, pages, and slides, beside the signature at the foot of every page
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  },

  // The first run, for the record: Hosts shows these folded under "How the first run went". They are view-only now.
  record: {
    ran: "Hands On, Friday, October 9, 2026, for MNGAIA · AI4MN",
    planner: "https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit",
    gallery: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_407",
    wonder: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_144",
    worry: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_86",
    next: "We turn to assessment: what our practices have measured, who they have served, and who they may have held back."   // what the first run said next
  },

  // What comes after this session, said at the close. Empty, the close says only thank you.
  next: "",

  // Cues inside the parts, in minutes. Write one as {nudge}, or move a time by it: {invent.end - nudge}.
  pace: {
    showTurn: 4,       // each builder's turn at Show & Tell (the stage timer starts here)
    roomsReady: 2,     // the co-host has the rooms ready this long before they open
    demo: 10,          // the three tabs, live (the stage timer starts here)
    buildAlong: 5,     // anchors share their screen at the start of the rooms
    nudge: 10,         // hosts visit each room this long before building ends
    share: [2, 3],     // each builder's turn at Show & Cheer (the stage timer uses the longer)
    wonder: 2          // time for the wonder and worry wall at the close
  },

  // The morning, in order. The parts run end to end from the start, so changing one part's
  // minutes moves every part after it. Each part has:
  //   id           a short name for braces: {remix.start}, {invent.end}, {invent.length}
  //   minutes      how long it runs
  //   where        "Main room" or "Breakout rooms"
  //   hint         one line for participants
  //   link         which page (and place) to send people to; linkLabel names the button, a verb first
  //   also         other pages this part sends some people to, shown beside its button: { link, label }
  //   shared       links from `links` above that this part uses, shown with it: { link: "planner", label: "Breakout Planner" }
  //   screens      what the presenter view shows, in order (note: what the presenter says or does,
  //                timer: a pace name, "building", or minutes for a countdown the presenter starts and adjusts live;
  //                screens that share a timerKey show one timer, so it keeps counting from screen to screen)
  //   host         a checklist for hosts
  //   messages     ready-to-paste chat messages for hosts
  segments: [
    {
      id: "welcome", minutes: 8, title: "Welcome", where: "Main room",
      hint: "The plan for the morning, then the chat: how much have you built with AI, from 1 to 5, and what was it?",
      link: "index.html#today",
      screens: [
        { kind: "title", note: "Welcome people as they arrive. Say: this is a session to play; nobody here is a developer by trade. (The first run added: a month into the school year. Change it to fit your group.)", heading: "{title}", sub: "{subtitle}. {Length} to play, build, and break things with AI, together." },
        { kind: "prompt", note: "Say: finish the sentence in the chat: I'd invent a thing that… An invention here is a small tool you'd want for your work. Read two or three aloud. Co-host: copy each idea into the Ideas list in the Breakout Planner (the shared Google Doc you made from Hosts, Before the day; its link goes in the chat at Pick your level); main-room chat won't follow people into rooms.", heading: "While we gather", big: "I'd invent a thing that...", body: "Finish the sentence in the chat. Any idea counts." },
        { kind: "embed", note: "Do: share the stage tab in Meet with tab audio on (not this notes window). The Oracle is built into this screen: type two or three questions from the chat into its box and press Consult. Don't explain how it knows yet; that's the close.", heading: "Ask the Oracle", src: "cabinets/oracle.html", caption: "Questions from the chat, answered live." },
        { kind: "plan", note: "Do: paste the site's address in the chat if you haven't. Say one sentence per part: Three levels ({levels.length}), Show & Tell ({show.length}), the Remix Arcade ({remix.length}), Invent your own ({invent.length}), Show & Cheer ({cheer.length}), the close ({close.length}).", heading: "Here's what we're here to do", url: true },
        { kind: "prompt", note: "Say: a number from 1 to 5 in the chat; 1 is not yet, 5 is I'm having a hard time stopping. Read a few aloud as they come in; every number is welcome, and a room of 1s is a good room. Co-host: list the 4s and 5s. They're the anchors: one per breakout room, who shares their screen first so the room has something to start from. Message each one privately to say so.", heading: "How much have you built with AI?", big: "1 to 5, in the chat", body: "1: not yet. 5: I'm having a hard time stopping." },
        { kind: "prompt", note: "Say: built something already? One sentence: what was it? Read two or three aloud; whatever they name, it fits one of the three levels coming next, so say so as you read. Co-host: add the builders to the anchors list.", heading: "Built something already?", big: "What was it?", body: "One sentence in the chat. We'll ask some of you to show it after the next part." }
      ],
      host: [
        "Pin the page link in the main chat.",
        "Turn on captions.",
        "Ask the Oracle two or three questions from the chat. It's built into the stage screen; share the tab with its sound on.",
        "Co-host: from the chat, list the 4s, the 5s, and anyone who says what they built. They're the anchors, one for each room.",
        "Co-host: copy each idea from the chat into the Ideas list in the Breakout Planner; main-room chat won't follow people into rooms."
      ],
      messages: [
        { to: "Main chat", text: "Welcome! Everything for today is here: https://{url}\nPage blocked on your network? The same session as slides: {links.backup}\nWhile we gather, finish this sentence in the chat: I'd invent a thing that..." },
        { to: "Main chat", text: "How much have you built with AI? Type a number from 1 to 5.\n1: not yet. 5: I'm having a hard time stopping." },
        { to: "Main chat", text: "Built something already? In one sentence: what was it?" }
      ]
    },
    {      id: "levels", minutes: 12, title: "Three levels of getting started", where: "Main room",
      hint: "In the chat, on your site, behind the scenes: three levels of getting started with code. Your host shows each one live.",
      link: "levels.html", linkLabel: "Open Three levels",
      screens: [
        { kind: "ladder", note: "Say, one sentence each, before any tab opens: In the chat, a small tool that runs inside your AI chat, like the Oracle and every starter on the site. On your site, a document you already have becomes a page on your Google Site. Behind the scenes, a short script does a job in your Drive. Every level is a good level; there's always a next one, and it's closer than it looks.", heading: "Three levels of getting started with code", rungs: [
          { name: "In the chat", why: "A small tool that runs right inside your AI chat. The Oracle. Every starter on this site." },
          { name: "On your site", why: "A document you already have becomes an interactive page, pasted into a Google Site." },
          { name: "Behind the scenes", why: "A short script does the work for you: point it at a Drive folder and get an inventory of everything inside." }
        ], foot: "Three tabs are open. Let's go." },
        { kind: "prompt", note: "Do: switch your share to the Chrome window with the three tabs you set up before the day (Hosts, Before the day). Tab 1: your AI with the Oracle starter pasted in and running. Tab 2: Gemini with Canvas on, the Charter Cards prompt and a made-up charter ready to paste, and your Google Site open to edit. Tab 3: the Apps Script editor with the Drive Inventory, a practice folder's ID in place, run once already so no permission screen appears. Start one, switch while it thinks, start the next: about four minutes each. This notes window keeps the clock. Then share the stage's tab again.", heading: "Three tabs, live", big: "1 · 2 · 3", body: "A starter in the chat. A charter that becomes a page on a Google Site. A script that lists a whole folder.", foot: "Every level is a good level.", timer: "demo" }      ],
      host: [
        "Have the three demo tabs open in one Chrome window, set up as Hosts lists under Before the day.",
        "Name the three levels in a sentence each before any tab opens. Then share Chrome as a window, not a single tab, so the switches come through. About four minutes per level.",
        "Back to the stage for Show & Tell."
      ],
      messages: [
        { to: "Main chat", text: "Three levels of getting started with code: in the chat, on your site, behind the scenes. All three, with the prompts and the script, ready to copy: https://{url}/levels.html" }
      ]
    },
    {
      id: "show", minutes: 8, title: "Show & Tell", where: "Main room",
      hint: "Done one of these already? Open mic: show it, or tell us about it. Then pick your level: write your name under it in the Breakout Planner, a shared Google Doc your host links in the chat.",
      link: "levels.html#pick", linkLabel: "Pick your level",
      shared: [{ link: "planner", label: "Breakout Planner" }],
      screens: [
        { kind: "prompt", note: "Say: who has done one of these? Show it, or tell us: which level, what it does, one thing that went sideways. Builders share with Present now, then A tab. Do: stop your own share while they present. On the stage window, T starts the screen's timer when someone starts; + and − stretch it; the timer's own Reset between people (not Reset the session clock). Share the stage again after.", heading: "Done one of these?", body: "Show it, or tell us about it: which level, what it does, and one thing that went sideways.", timer: "showTurn" },
        { kind: "steps", note: "Co-host: paste the Breakout Planner's link in the chat now. Say: open it and add your name under the level you want to try, and a partner's name next to yours if you have one. Any level is a good level, and the one that would stretch you a little is the best one. Co-host: make rooms of up to four from each level's list, partners together, an anchor in each where one fits, and write the room numbers in the Room column. Allow about five minutes.", heading: "Pick your level", steps: [
          "Open the Breakout Planner.",
          "Add your name under the level you want to try today: 1, 2, or 3.",
          "Want company? Put a partner's name next to yours, or two."
        ], foot: "Stretch a little. Any level is a good level." }
      ],
      host: [
        "Before you start: in Host controls, keep Share their screen on for everyone. No one needs to be a co-host to present.",
        "Builders share with Present now, then A tab, so their tab's sound comes through.",
        "Start the stage timer when they start; Reset between people.",
        "Co-host: paste the Breakout Planner's link in the chat. As names land under the levels, open Breakout rooms and make rooms of up to four from each level's list, partners together. Rooms = names ÷ 4, rounded up, for each level.",
        "Co-host: put an anchor (a 4, a 5, or someone who said what they built) in each room where one fits, write each person's room number in the Room column, message each anchor privately (\"You're your room's anchor: share your screen first and start a starter together\"), and set the breakout timer to {building}."
      ],
      messages: [
        { to: "Main chat", text: "Done one of these already? Raise your hand and show us. To share: Present now, then A tab, then pick the tab with your tool." },
        { to: "Main chat", text: "Pick your level: open the Breakout Planner and add your name under 1, 2, or 3. Working with someone? Put their name next to yours.\n{links.planner}" }
      ]
    },
    {
      id: "remix", minutes: 17, title: "The Remix Arcade", where: "Breakout rooms",
      hint: "The hosts move you into a breakout room with others at your level, and you stay in it for Invent your own. Level 1 (in the chat): pick a starter and make it yours. Levels 2 (on your site) and 3 (behind the scenes): open your level on Three levels, get its example working, then make it yours.",
      link: "starters.html", linkLabel: "Open the starters",
      also: [{ link: "levels.html#site", label: "Levels 2 and 3: open Three levels" }],
      shared: [{ link: "planner", label: "Breakout Planner" }],
      screens: [
        { kind: "steps", note: "Say the four steps on the screen: find your room number next to your name in the Breakout Planner; your anchor shares their screen and everyone builds along for {buildAlong}; level 1 picks a starter and makes it theirs, levels 2 and 3 run their level's example from Three levels; stuck means Ask for help in Meet. Co-host: open the rooms as this screen ends.", heading: "Off to your room", steps: [
          "Find your room number next to your name in the Breakout Planner.",
          "Your anchor shares their screen. Build along for {buildAlong}.",
          "Level 1: pick a starter and make it yours. Levels 2 and 3: run your level's example, then make it yours.",
          "Stuck? Press Ask for help in Meet."
        ], foot: "Back in the main room in {building}" },        { kind: "link", note: "Do: leave this up for a minute as the rooms open, and paste the site's address in the main chat once more for anyone still there. The Remix Arcade: each room picks a starter and changes one thing about it.", heading: "Everything is here", body: "The starters, the three levels, the Breakout Planner, and the gallery wall." },
        { kind: "prompt", note: "Do: T starts the building timer ({building}) as the rooms open; it keeps counting on the next screen, and + and − nudge it. The session clock in the corner keeps the big picture. You stay in the main room and invent from an idea in the chat, live, with anyone who stays; the co-host visits rooms and watches for Ask for help.", heading: "Rooms are building", body: "Rather watch? Stay here. We're inventing live in the main room, from your ideas.", timer: "building", timerKey: "building" }      ],
      host: [
        "Walk the four steps on the stage: find your room number in the Breakout Planner; your anchor shares their screen and everyone builds along for {buildAlong}; level 1 picks a starter, levels 2 and 3 run their level's example; stuck means Ask for help in Meet.",
        "Co-host: open the rooms.",
        "Paste the page link into each room's chat as you visit (breakout chats start empty).",
        "The presenter stays in the main room, inventing live from the chat's ideas with anyone who stays; the co-host visits rooms and watches for Ask for help."
      ],
      messages: [
        { to: "Each breakout room", text: "Everything's here: https://{url}\nLevel 1: the starters. Levels 2 and 3: your example, prompt, and script are at https://{url}/levels.html\nAnchor: share your screen and start one together.\nPage blocked? The starters as slides, code in the notes: {links.companion}" }
      ]
    },
    {
      id: "invent", minutes: 40, title: "Invent your own", where: "Breakout rooms",
      hint: "Same room. Invent something from nothing at your level: your own idea, or one from the Breakout Planner.",
      link: "invent.html", linkLabel: "Start your invention",
      shared: [{ link: "gallery", label: "Gallery wall" }],
      screens: [        { kind: "prompt", note: "Do: when the building timer shows {invent.length} left, the Remix Arcade is over: the co-host visits each room to say switch to inventing your own: your own idea, or one from the Breakout Planner (Meet can't message every room at once; the Planner's top line can carry the word too). Same timer as the last screen, still counting; don't reset it. With {nudge} left, visit each room again: pin something to the gallery wall (the walls deck you made from Hosts, linked in the chat), even half-built. Co-host: while visiting, note one build for each award: Most Delightfully Broken, Best Rescue, Most Likely to Actually Get Used. At zero, the co-host closes the rooms. Keep building in the main room meanwhile.", heading: "Invent your own", body: "Your own idea, at your level, or one from the Breakout Planner. Pin something to the gallery wall before you head back.", timer: "building", timerKey: "building" }      ],
      host: [
        "At the switch from the Remix Arcade, visit each room to say: switch to inventing your own: your own idea, or one from the Breakout Planner. (Meet can't message every room at once; a line at the top of the Breakout Planner, which everyone has open, carries the word too.)",
        "With {nudge} left, visit each room again, or change the Planner's top line: pin something to the gallery wall, even half-built.",
        "Co-host: note one build for each award (Most Delightfully Broken, Best Rescue, Most Likely to Actually Get Used), and one or two builders to ask first at Show & Cheer.",
        "At zero, the co-host closes the rooms; Meet gives everyone a short countdown."
      ],
      messages: [
        { to: "Each breakout room", text: "{Nudge} left! Pin what you have to the gallery wall, even if it's half-built. Half-built counts.\nHow: https://{url}/invent.html#wall" }
      ]
    },
    {
      id: "cheer", minutes: 22, title: "Show & Cheer", where: "Main room",
      hint: "Back in the main room. A few builders share their screens, two or three minutes each. Applause first.",
      link: "index.html#cheer", linkLabel: "See the awards",
      shared: [{ link: "gallery", label: "Gallery wall" }],
      screens: [
        { kind: "prompt", note: "Say: welcome back; raise a hand to share. Applause first, then one question: who would you show this to? About three minutes each, so five or six builds; Reset the timer between builders. Co-host: line up the next builder from the gallery wall.", heading: "Show & Cheer", body: "A few builders share their screens. Applause first, emoji welcome. One question for each builder: who would you show this to?", timer: "share" },
        { kind: "awards", note: "Say: three awards, on the screen: Most Delightfully Broken, Best Rescue, Most Likely to Actually Get Used. Read the co-host's list: the award, then the build and its builders. For fun, not ranking.", heading: "This morning's awards", awards: [
          { icon: "bug", name: "Most Delightfully Broken", why: "For the most glorious error message of the morning." },
          { icon: "life-buoy", name: "Best Rescue", why: "For the save that made the room cheer." },
          { icon: "calendar-check", name: "Most Likely to Actually Get Used", why: "For the one somebody will really open next week." }
        ] }
      ],
      host: [
        "Builders share with Present now, then A tab, so their tab's sound comes through. About three minutes each; Reset the stage timer between builders.",
        "If sharing fails, share the gallery wall and click their picture to open what they made.",
        "Read the awards from the co-host's list. For fun, not ranking."
      ],
      messages: [
        { to: "Main chat", text: "Show & Cheer! Want to share? Raise your hand. To share: Present now, then A tab, then pick your AI tab." }
      ]
    },
    {
      id: "close", minutes: 13, title: "What did we just do?", where: "Main room",
      hint: "One wonder, one worry, one word.",
      link: "index.html#close", linkLabel: "Add your wonder and worry",
      shared: [{ link: "wonder", label: "Wonder wall" }, { link: "worry", label: "Worry wall" }],
      screens: [        { kind: "code", note: "Say: the Oracle didn't know anything. The screen shows its two tricks. The swaps: it turns I into you and my into your and hands your question back (a program called ELIZA did the same in 1966). The list of words: a handful it listens for, like coffee or lunch, each with a line a person wrote. Point at one swap and one word from a question asked earlier. Every machine today started with a person and came back to a person.", heading: "How did the Oracle know?", code: "SWAPS = { i: \"you\", my: \"your\", am: \"are\" }\n\nlistensFor: [\"coffee\", \"caribou\", \"lunch\", \"potluck\"],\nprophecies: [\n  \"The line at Caribou will be long, and worth it.\",\n  \"The hotdish will contain tater tots. Tot-ally.\"\n]", caption: "A few swaps and a list of words, both chosen by a person. Every machine today started with a person, passed through an AI, and came back to a person." },
        { kind: "ladder", note: "Say: the three levels from today, and a fourth we only wave at: an app where the AI works inside the files on your computer (Claude Code, Codex, Cursor). This site was built that way. Not for today; for when level three feels easy.", heading: "Where this goes", rungs: [
          { name: "In the chat", why: "A tool inside your AI chat. Twenty minutes." },
          { name: "On your site", why: "A page on your Google Site. An hour." },
          { name: "Behind the scenes", why: "A script in your Drive. An afternoon." },
          { name: "With a workbench", why: "Claude Code, Codex, Cursor: the AI works inside your files. When level three feels easy.", later: true }
        ] },        { kind: "quote", note: "Say it, then let it sit for a moment.", text: "Everything you made today, a seventh grader can make tonight." },
        { kind: "pair", note: "Do: post the wonder and worry links in the chat (the closing message on Hosts carries them). Say: one wonder, one worry, on the walls. Give it {wonder}.", heading: "Before you go", cards: [
          { heading: "I wonder...", body: "What did today make you curious about?" },
          { heading: "I worry...", body: "What did today make you uneasy about?" }
        ], foot: "Add yours to the wall. Then one word in the chat for how you're leaving.", timer: "wonder" },
        { kind: "prompt", note: "Say: one word in the chat for how you're leaving. Thank the anchors by name. Then what your group does next, if anything: this screen shows the session file's next line, and says only thank you when that's empty.", heading: "Next time", body: "{next}", foot: "Thank you for building with us.", url: true }
      ],
      host: [
        "Post the wonder and worry links in the chat; the message below carries them.",
        "Thank the anchors by name.",
        "Say what your group does next, if anything. The last screen shows the session file's next line; leave it empty and the screen says only thank you."
      ],
      messages: [
        { to: "Main chat", text: "One wonder, one worry: add yours to the walls.\nI wonder: {links.wonder}\nI worry: {links.worry}\nThen one word in the chat for how you're leaving." }
      ]
    }
  ]
};
