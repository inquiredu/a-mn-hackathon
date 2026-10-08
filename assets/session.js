// The session file. Everything about this session lives here:
// the participant page, the presenter view, and the host view all read it.
// To run a new session, copy this file and change what's inside.
//
// Times live only here. Anywhere in this file's text, or in a page element marked data-fill,
// write a time, date, or length in braces: {start}, {wish.end - nudge}, {Length}, {weekday}.
// assets/timing.js fills them in, and lists everything you can write.

const SESSION = {
  title: "Hands On",
  subtitle: "A {weekday} Hackathon",
  org: "MNGAIA · AI4MN",
  day: "2026-10-09",                 // the clock-driven parts only run on this day
  timeZone: "America/Chicago",
  start: "10:00",                    // when the session starts and ends, as advertised (24-hour)
  end: "12:00",
  dateLabel: "{weekday}, {date} · {start} to {end} {zone}",   // shown in the bar on other days
  url: "inquiredu.org/a-mn-hackathon",

  // Shared spaces and decks. A link shows on the site as soon as it's here; leave one empty and the page says it's coming soon.
  links: {
    meet: "https://meet.google.com/wvq-zzwe-kny",
    teams: "https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit",
    // The walls deck ("Interactive Workshop Walls"): one slide each, linked straight to the slide.
    // Anyone with the link can edit it, so people from every district can add to it.
    gallery: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_407",
    wonder: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_144",
    worry: "https://docs.google.com/presentation/d/16AH9SRKlTVhr5ZlEQFnxO0C6IiMcbNto0pNX7RZuMcw/edit#slide=id.h481799e189d257a0_0_86",
    // Backups for when this site is blocked. Labeled by what's inside, because the Drive titles read the other way round.
    // Session slides: the whole morning, screen by screen (Drive title "Hands On Backup Deck").
    backup: "https://docs.google.com/presentation/d/18BmKOht78NXQ2H3AvPgt3uLm9zQGRsD03dB2EBBd020/edit",
    // Starter code: every starter's code and remix menu, in the speaker notes (Drive title "Backup slide deck for session").
    companion: "https://docs.google.com/presentation/d/1L3rwzGa4nrh1HDlExkhGetHYmQeqq_-cMcc8mmovtDM/edit"
  },

  // Cues inside the parts, in minutes. Write one as {nudge}, or move a time by it: {wish.end - nudge}.
  pace: {
    anchors: 5,        // at the start of Welcome, builders add their names as anchors
    roomsReady: 2,     // the co-host has the rooms ready this long before they open
    buildAlong: 5,     // anchors share their screen at the start of the rooms
    nudge: 10,         // hosts visit each room this long before building ends
    share: [2, 3],     // each builder's turn at Show & Cheer
    wonder: 2          // time for the wonder and worry wall at the close
  },

  // The morning, in order. The parts run end to end from the start, so changing one part's
  // minutes moves every part after it. Each part has:
  //   id           a short name for braces: {remix.start}, {wish.end}, {wish.length}
  //   minutes      how long it runs
  //   where        "Main room" or "Breakout rooms"
  //   hint         one line for participants
  //   link         which page (and place) to send people to; linkLabel names the button
  //   shared       links from `links` above that this part uses, shown with it: { link: "teams", label: "Teams doc" }
  //   screens      what the presenter view shows, in order (note: what the presenter says or does,
//                shown only in the speaker-notes window)
  //   host         a checklist for hosts
  //   messages     ready-to-paste chat messages for hosts
  segments: [
    {
      id: "welcome", minutes: 8, title: "Welcome", where: "Main room",
      hint: "Drop a wish in the chat: \"I wish I had a thing that...\"",
      link: "index.html#today",
      shared: [{ link: "teams", label: "Teams doc" }],
      screens: [
        { kind: "title", note: "Welcome people as they arrive. A month in, this is a morning to play. Nobody here is a developer by trade.", kicker: "MNGAIA · AI4MN", heading: "Hands On", sub: "{subtitle}. {Length} to play, build, and break things with AI, together." },
        { kind: "prompt", note: "Ask for wishes in the chat and read two or three aloud. Main-room chat won't follow people into breakout rooms, so the Teams doc keeps the wishes.", heading: "While we gather", big: "I wish I had a thing that...", body: "Finish the sentence in the chat. Any wish counts." },
        { kind: "embed", note: "Share this tab with its sound on. Ask the Oracle two or three questions from the chat. Don't explain how it knows yet; that's the close.", heading: "Ask the Oracle", src: "cabinets/oracle.html", caption: "Questions from the chat, answered live." },
        { kind: "prompt", note: "Ask anyone who has built something interactive with AI, even once, to add their name. A raised hand works too. Your co-host watches the Teams doc.", heading: "Have you built something interactive with code?", body: "Even once, with any AI tool? Open the page, press Teams doc, and add your name. You'll anchor a team of four.", url: true }
      ],
      host: [
        "Pin the page link in the main chat.",
        "Turn on captions.",
        "Ask the Oracle two or three questions from the chat."
      ],
      messages: [
        { to: "Main chat", text: "Welcome! Everything for today is here: https://inquiredu.org/a-mn-hackathon\nPage blocked on your network? The same morning as slides: {links.backup}\nWhile we gather, finish this sentence in the chat: I wish I had a thing that..." },
        { to: "Main chat", text: "Have you built something interactive with AI, even once? Open the page, press Teams doc, and add your name to the first table. You'll anchor a team of four." }
      ]
    },
    {
      id: "watch", minutes: 12, title: "Watch one get built", where: "Main room",
      hint: "One wish from the chat, built live, broken on purpose, and fixed.",
      link: "index.html#today",
      screens: [
        { kind: "prompt", note: "Switch your share to your AI tab. Build one wish from the chat and say what you type as you go. Break it on purpose, then fix it. Your co-host sets up the rooms now.", heading: "Watch one get built", body: "One wish from the chat. Built live, broken on purpose, and fixed." }
      ],
      host: [
        "Co-host: open Breakout rooms. Rooms = builders ÷ 4, rounded up.",
        "Press Shuffle, then drag one anchor from the Teams doc into each room.",
        "Fill in the Room column for each anchor in the Teams doc.",
        "Set the breakout timer to {building}."
      ],
      messages: []
    },
    {
      id: "remix", minutes: 25, title: "The Remix Arcade", where: "Breakout rooms",
      hint: "In breakout rooms of four. Pick a starter and make it yours.",
      link: "starters.html", linkLabel: "Open the starters",
      shared: [{ link: "teams", label: "Teams doc" }],
      screens: [
        { kind: "steps", note: "Walk the four steps. Anchors share their screen first. Then open the rooms.", heading: "Off to your room", steps: [
          "Add your name to your team in the Teams doc.",
          "Your anchor shares their screen. Build along for {buildAlong}.",
          "Pick a starter and make it yours.",
          "Stuck? Press Ask for help in Meet."
        ], foot: "Back in the main room at {wish.end}" },
        { kind: "link", note: "Leave this up while the rooms open, and paste the link in the main chat once more.", heading: "Everything is here", body: "The starters, the Teams doc, and the gallery wall." },
        { kind: "countdown", note: "For anyone who stays in the main room: build wishes live with them.", heading: "Rooms are building", until: "{wish.end}", body: "Rather watch? Stay here. We're building wishes live in the main room." }
      ],
      host: [
        "Open the rooms.",
        "Paste the page link into each room's chat as you visit (breakout chats start empty).",
        "One host stays in the main room, building wishes live."
      ],
      messages: [
        { to: "Each breakout room", text: "Everything's here: https://inquiredu.org/a-mn-hackathon\nPress Teams doc and add your name to your room. Anchor: share your screen and start a starter together.\nPage blocked? The starters as slides, code in the notes: {links.companion}" }
      ]
    },
    {
      id: "wish", minutes: 35, title: "Grant a wish", where: "Breakout rooms",
      hint: "Same room. Build something from scratch, your wish or someone else's.",
      link: "wish.html", linkLabel: "How to start",
      shared: [{ link: "gallery", label: "Gallery wall" }],
      screens: [
        { kind: "countdown", note: "Keep building in the main room. At {wish.end - nudge}, hosts visit each room to say there are {nudge} left.", heading: "Grant a wish", until: "{wish.end}", body: "Your wish, or one from the Teams doc. Pin something to the gallery wall before {wish.end}." }
      ],
      host: [
        "At {wish.end - nudge}, visit each room: {nudge} left, pin something to the gallery wall.",
        "Note one or two builds for Show & Cheer."
      ],
      messages: [
        { to: "Each breakout room", text: "{Nudge} left! Pin what you have to the gallery wall, even if it's half-built. Half-built counts.\nHow: https://inquiredu.org/a-mn-hackathon/wish.html#wall" }
      ]
    },
    {
      id: "cheer", minutes: 22, title: "Show & Cheer", where: "Main room",
      hint: "Back in the main room. Applause first.",
      link: "index.html#cheer", linkLabel: "The awards",
      shared: [{ link: "gallery", label: "Gallery wall" }],
      screens: [
        { kind: "prompt", note: "Welcome everyone back. Ask for volunteers by raised hand. Applause first, then one question: who would you show this to?", heading: "Show & Cheer", body: "A few builders share their screens. Applause first, emoji welcome. One question for each builder: who would you show this to?" },
        { kind: "awards", note: "Name the builds that earned each award.", heading: "This morning's awards", awards: [
          { icon: "💥", name: "Most Delightfully Broken", why: "For the most glorious error message of the morning." },
          { icon: "🛟", name: "Best Rescue", why: "For the save that made the room cheer." },
          { icon: "🗓️", name: "Most Likely to Actually Get Used", why: "For the one somebody will really open next week." }
        ] }
      ],
      host: [
        "Builders share with Present now, then A tab, so their tab's sound comes through.",
        "If sharing fails, share the gallery wall and click their picture to open what they made."
      ],
      messages: [
        { to: "Main chat", text: "Show & Cheer! Want to share? Raise your hand. To share: Present now, then A tab, then pick your AI tab." }
      ]
    },
    {
      id: "close", minutes: 13, title: "What did we just do?", where: "Main room",
      hint: "One wonder, one worry, one word.",
      link: "index.html#close", linkLabel: "The close",
      shared: [{ link: "wonder", label: "Wonder wall" }, { link: "worry", label: "Worry wall" }],
      screens: [
        { kind: "code", note: "Show the list of words. The Oracle didn't know anything: a person chose what it listens for.", heading: "How did the Oracle know?", code: "listensFor: [\"coffee\", \"caribou\", \"lunch\", \"potluck\"],\nprophecies: [\n  \"The line at Caribou shall be long. Accept this.\",\n  \"The hotdish will contain tater tots. This is certain.\"\n]", caption: "A list of words a person chose. Every machine today started with a person, passed through an AI, and came back to a person." },
        { kind: "quote", note: "Say it, then let it sit for a moment.", text: "Everything you made today, a seventh grader can make tonight." },
        { kind: "pair", note: "Post the wonder and worry link in the chat. Give it {wonder}.", heading: "Before you go", cards: [
          { heading: "I wonder...", body: "What did today make you curious about?" },
          { heading: "I worry...", body: "What did today make you uneasy about?" }
        ], foot: "Add yours to the wall. Then one word in the chat for how you're leaving." },
        { kind: "prompt", note: "Ask for one word in the chat. Thank the anchors by name. Point to next month.", heading: "Next month", body: "We turn to assessment: what our practices have measured, who they have served, and who they may have held back.", foot: "Thank you for building with us." }
      ],
      host: [
        "Post the wonder and worry link in the chat.",
        "Thank the anchors by name."
      ],
      messages: [
        { to: "Main chat", text: "One wonder, one worry: add yours to the wall. Then one word in the chat for how you're leaving." }
      ]
    }
  ]
};
