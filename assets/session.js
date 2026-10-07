// The session file. Everything about this session lives here:
// the participant page, the presenter view, and the host view all read it.
// To run a new session, copy this file and change what's inside.

const SESSION = {
  title: "Hands On",
  subtitle: "A Friday Hackathon",
  org: "MNGAIA · AI4MN",
  day: "2026-10-09",                 // the clock-driven parts only run on this day
  timeZone: "America/Chicago",
  dateLabel: "Friday, October 9 · 10:00 to noon Central",
  url: "inquiredu.org/a-mn-hackathon",

  // Shared spaces. Leave a link empty and the page says it appears on the day.
  links: {
    teams: "https://docs.google.com/document/d/1X_kzm4zUjvb5ZqlQBZmPgmirchg_bLJlhlGVhbQApGk/edit",
    gallery: "",
    wonder: ""
  },

  // The morning, in order. Each part has:
  //   start, end   clock times (24-hour)
  //   where        "Main room" or "Breakout rooms"
  //   hint         one line for participants
  //   link         where on the participant page to send people
  //   screens      what the presenter view shows, in order
  //   host         a checklist for hosts
  //   messages     ready-to-paste chat messages for hosts
  segments: [
    {
      start: "10:00", end: "10:08", title: "Welcome", where: "Main room",
      hint: "Drop a wish in the chat: \"I wish I had a thing that...\"",
      link: "#today",
      screens: [
        { kind: "title", kicker: "MNGAIA · AI4MN", heading: "Hands On", sub: "A Friday Hackathon. Two hours to play, build, and break things with AI, together." },
        { kind: "prompt", heading: "While we gather", big: "I wish I had a thing that...", body: "Finish the sentence in the chat. Any wish counts." },
        { kind: "embed", heading: "Ask the Oracle", src: "cabinets/oracle.html", caption: "Questions from the chat, answered live." },
        { kind: "prompt", heading: "Have you built something interactive with code?", body: "Even once, with any AI tool? Open the page, press Teams doc, and add your name. You'll anchor a team of four.", url: true }
      ],
      host: [
        "Pin the page link in the main chat.",
        "Turn on captions.",
        "Ask the Oracle two or three questions from the chat."
      ],
      messages: [
        { to: "Main chat", text: "Welcome! Everything for today is here: https://inquiredu.org/a-mn-hackathon\nWhile we gather, finish this sentence in the chat: I wish I had a thing that..." },
        { to: "Main chat", text: "Have you built something interactive with AI, even once? Open the page, press Teams doc, and add your name to the first table. You'll anchor a team of four." }
      ]
    },
    {
      start: "10:08", end: "10:20", title: "Watch one get built", where: "Main room",
      hint: "One wish from the chat, built live, broken on purpose, and fixed.",
      link: "#today",
      screens: [
        { kind: "prompt", heading: "Watch one get built", body: "One wish from the chat. Built live, broken on purpose, and fixed." }
      ],
      host: [
        "Co-host: open Breakout rooms. Rooms = builders ÷ 4, rounded up.",
        "Press Shuffle, then drag one anchor from the Teams doc into each room.",
        "Fill in the Room column for each anchor in the Teams doc.",
        "Set the breakout timer to 60 minutes."
      ],
      messages: []
    },
    {
      start: "10:20", end: "10:45", title: "The Remix Arcade", where: "Breakout rooms",
      hint: "In breakout rooms of four. Pick a starter and make it yours.",
      link: "#arcade", linkLabel: "Go to the arcade",
      screens: [
        { kind: "steps", heading: "Off to your room", steps: [
          "Add your name to your team in the Teams doc.",
          "Your anchor shares their screen. Build along for five minutes.",
          "Pick a starter and make it yours.",
          "Stuck? Press Ask for help in Meet."
        ], foot: "Back in the main room at 11:20" },
        { kind: "link", heading: "Everything is here", body: "The starters, the Teams doc, and the gallery wall." },
        { kind: "countdown", heading: "Rooms are building", until: "11:20", body: "Rather watch? Stay here. We're building wishes live in the main room." }
      ],
      host: [
        "Open the rooms.",
        "Paste the page link into each room's chat as you visit (breakout chats start empty).",
        "One host stays in the main room, building wishes live."
      ],
      messages: [
        { to: "Each breakout room", text: "Everything's here: https://inquiredu.org/a-mn-hackathon\nPress Teams doc and add your name to your room. Anchor: share your screen and start a starter together." }
      ]
    },
    {
      start: "10:45", end: "11:20", title: "Grant a wish", where: "Breakout rooms",
      hint: "Same room. Build something from scratch, your wish or someone else's.",
      link: "#wish", linkLabel: "How to start",
      screens: [
        { kind: "countdown", heading: "Grant a wish", until: "11:20", body: "Your wish, or one from the Teams doc. Pin something to the gallery wall before 11:20." }
      ],
      host: [
        "At 11:10, visit each room: ten minutes left, pin something to the wall.",
        "Note one or two builds for Show & Cheer."
      ],
      messages: [
        { to: "Each breakout room", text: "Ten minutes! Pin what you have to the gallery wall, even if it's half-built. Half-built counts." }
      ]
    },
    {
      start: "11:20", end: "11:42", title: "Show & Cheer", where: "Main room",
      hint: "Back in the main room. Applause first.",
      link: "#cheer", linkLabel: "The awards",
      screens: [
        { kind: "prompt", heading: "Show & Cheer", body: "A few builders share their screens. Applause first, emoji welcome. One question for each builder: who would you show this to?" },
        { kind: "awards", heading: "This morning's awards", awards: [
          { icon: "💥", name: "Most Delightfully Broken", why: "For the most glorious error message of the morning." },
          { icon: "🛟", name: "Best Rescue", why: "For the save that made the room cheer." },
          { icon: "🗓️", name: "Most Likely to Actually Get Used", why: "For the one somebody will really open next week." }
        ] }
      ],
      host: [
        "Builders share with Present now, then A tab, so their tab's sound comes through.",
        "If sharing fails, show their screenshot from the gallery wall."
      ],
      messages: [
        { to: "Main chat", text: "Show & Cheer! Want to share? Raise your hand. To share: Present now, then A tab, then pick your AI tab." }
      ]
    },
    {
      start: "11:42", end: "11:55", title: "What did we just do?", where: "Main room",
      hint: "One wonder, one worry, one word.",
      link: "#close", linkLabel: "The close",
      screens: [
        { kind: "code", heading: "How did the Oracle know?", code: "listensFor: [\"coffee\", \"caribou\", \"lunch\", \"potluck\"],\nprophecies: [\n  \"The line at Caribou shall be long. Accept this.\",\n  \"The hotdish will contain tater tots. This is certain.\"\n]", caption: "A list of words a person chose. Every machine today started with a person, passed through an AI, and came back to a person." },
        { kind: "quote", text: "Everything you made today, a seventh grader can make tonight." },
        { kind: "pair", heading: "Before you go", cards: [
          { heading: "I wonder...", body: "What did today make you curious about?" },
          { heading: "I worry...", body: "What did today make you uneasy about?" }
        ], foot: "Add yours to the wall. Then one word in the chat for how you're leaving." },
        { kind: "prompt", heading: "Next month", body: "We turn to assessment: what our practices have measured, who they have served, and who they may have held back.", foot: "Thank you for building with us." }
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
