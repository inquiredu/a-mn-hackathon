// The sources, as data. The Sources page builds its cards, filters, and paths from this file.
// Every source was opened and checked on October 7, 2026.
//
// Each source:
//   id         short and unique; becomes the link to this source (sources.html#id)
//   section    "moves", "care", or "thinking"
//   group      the heading it sits under within its section
//   title, url, also (extra links), who, venue, when
//   type       one of the TYPES below; peer: true if peer-reviewed
//   says       what it says, in a sentence or three
//   take       the takeaway, with takeLabel ("For Friday", "The habit", ...)
//   asks       its topics (keys from ASK_GROUPS below)

const SOURCE_SECTIONS = {
  moves: { title: "Learn the moves", blurb: "How to build in the tools you have, what the code actually is, and what \"vibe coding\" means, from the people who named it." },
  care: { title: "Proceed with care", blurb: "Each caution comes with a habit that answers it. None of them is a reason not to build. All of them are reasons to build thoughtfully." },
  thinking: { title: "Coding and thinking", blurb: "What learning to code does and doesn't do for thinking, where the ideas behind Friday come from, and what early research says about AI and beginners." }
};

const TYPES = {
  research: "Research",
  preprint: "Preprint",
  help: "Official help",
  policy: "Law, policy, and standards",
  essay: "Essays and commentary",
  learning: "Courses and primers",
  book: "Books"
};

// The topics in the "I want to know about..." list, in three groups. Each label also tags the
// cards. Shareable links use the keys (sources.html?ask=privacy), so keep a key when renaming its label.
const ASK_GROUPS = [
  { title: "Building", asks: { tools: "Your AI tool", code: "The code", sharing: "Sharing" } },
  { title: "Taking care", asks: { privacy: "Student data", security: "Code safety", access: "Accessibility" } },
  { title: "Teaching and learning", asks: { starting: "Teaching beginners", learning: "AI and learning", thinking: "Coding and thinking", assessment: "Assessment" } }
];
const ASKS = Object.assign({}, ...ASK_GROUPS.map((group) => group.asks));   // every topic: key → label

const PATHS = {
  firsttime: { title: "Never built anything?", blurb: "What code is, how to start in your tool, and the habits that make it work.", ids: ["mdn", "gemini-canvas", "chatgpt-preview", "willison-habits"] },
  leaders: { title: "Leading a school or district?", blurb: "Data practices, Minnesota law, accessibility, and a simple rule for what to share.", ids: ["mde", "mn-1332", "fpf-vetting", "ada-rule", "willison-vibe"] },
  teachers: { title: "Teaching with it next week?", blurb: "How beginners learn best, what helps and what harms, and a colleague's examples.", ids: ["primm", "bastani", "kazemitabaar", "ciddl"] },
  levels: { title: "Picked a level?", blurb: "The official help behind each of the three levels: Canvas, Sites' embed, Apps Script and its permission screen, and a glimpse of the workbench.", ids: ["gemini-canvas", "sites-embed", "apps-script-overview", "apps-script-authorization", "apps-script-driveapp", "claude-code-overview", "codex-overview"] },
  november: { title: "Thinking ahead to November?", blurb: "Process, artifacts, and explanation: where assessment is heading.", ids: ["brennan-resnick", "robots-are-here", "scherer-2019", "denny-2024"] }
};

const SOURCES = [
  // ---------- Learn the moves ----------
  {
    id: "gemini-canvas", section: "moves", group: "Building in the tools you have",
    title: "Create docs, apps & more with Canvas",
    url: "https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DDesktop",
    who: "Google", venue: "Gemini Apps Help", when: "as of October 2026", type: "help",
    says: "The steps for opening Canvas in Gemini, editing the code directly or asking Gemini for changes, and sharing with a link. It notes that anyone with a public app link can view and edit the app's data.",
    takeLabel: "For Friday", take: "The exact steps for most Google districts.",
    asks: ["tools", "sharing"]
  },
  {
    id: "gemini-sharing", section: "moves", group: "Building in the tools you have",
    title: "Share chats, canvases, and generated media from the Gemini app securely via Google Drive",
    url: "https://workspaceupdates.googleblog.com/2026/04/share-chats-canvases-and-generated-media-from-the-Gemini-app-securely-via-Google-Drive.html",
    also: [{ label: "June 2026: Share to Classroom", url: "https://workspaceupdates.googleblog.com/2026/06/educators-and-students-can-now-share-Gemini-Canvas-creations-directly-to-Google-Classroom.html" }],
    who: "Google", venue: "Google Workspace Updates", when: "May 2026", type: "help",
    says: "Workspace accounts can share canvases with Drive-style sharing that follows the district's own Drive policy, including whether sharing outside the district is allowed. In June, Google added Share to Classroom for Education editions.",
    takeLabel: "For Friday", take: "Why the Share button may look different for people from different districts.",
    asks: ["sharing", "tools"]
  },
  {
    id: "claude-artifacts", section: "moves", group: "Building in the tools you have",
    title: "What are artifacts and how do I use them?",
    url: "https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them",
    also: [{ label: "Publishing and sharing artifacts", url: "https://support.claude.com/en/articles/9547008-publishing-and-sharing-artifacts" }],
    who: "Anthropic", venue: "Claude Help Center", when: "updated September 2026", type: "help",
    says: "Artifacts work on every plan, including free, once code execution and file creation are turned on in Settings, Capabilities. On personal plans, publishing creates a link anyone can open without an account, and unpublishing can't be undone.",
    takeLabel: "For Friday", take: "A free account is enough to build something and hand someone a working link, and a published link is public.",
    asks: ["tools", "sharing"]
  },
  {
    id: "chatgpt-preview", section: "moves", group: "Building in the tools you have",
    title: "Working with writing blocks and code blocks in ChatGPT",
    url: "https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt",
    also: [{ label: "ChatGPT release notes", url: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes" }],
    who: "OpenAI", venue: "OpenAI Help Center", when: "updated October 2026", type: "help",
    says: "A Preview switch on code blocks shows web pages and other code running inside ChatGPT. The release notes for May 28, 2026 say canvas is no longer available in the current GPT-5.5 models.",
    takeLabel: "For Friday", take: "In ChatGPT, look for Preview on the code block, not a canvas button.",
    asks: ["tools"]
  },
  {
    id: "copilot-pages", section: "moves", group: "Building in the tools you have",
    title: "Build lightweight apps within Microsoft Copilot Pages",
    url: "https://support.microsoft.com/en-us/microsoft-365-copilot/build-lightweight-apps-within-microsoft-365-copilot-pages",
    who: "Microsoft", venue: "Microsoft Support", when: "April 2026", type: "help",
    says: "Describe an app and Copilot builds a page you can preview. It works for work or school accounts with SharePoint or OneDrive storage, even without a Microsoft 365 Copilot license.",
    takeLabel: "For Friday", take: "A way in for people from Microsoft districts.",
    asks: ["tools"]
  },
  {
    id: "chatgpt-sharing", section: "moves", group: "Building in the tools you have",
    title: "Sharing conversations and scheduled tasks in ChatGPT",
    url: "https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq",
    who: "OpenAI", venue: "OpenAI Help Center", when: "updated September 2026", type: "help",
    says: "Share, then Create link or Copy link, shares a snapshot of the conversation. From a personal account, anyone with the link can view it. From a Business, Enterprise, or Edu workspace, only members of that workspace can.",
    takeLabel: "For Friday", take: "Why a ChatGPT link from a school workspace may not open for someone from another district.",
    asks: ["sharing", "tools"]
  },
  {
    id: "copilot-sharing", section: "moves", group: "Building in the tools you have",
    title: "Share a Microsoft 365 Copilot Page",
    url: "https://support.microsoft.com/en-us/microsoft-365-copilot/share-a-microsoft-365-copilot-page",
    who: "Microsoft", venue: "Microsoft Support", when: "as of October 2026", type: "help",
    says: "Share, at the top right of a page, offers Copy link or Copy component. The link opens that one page in Loop for colleagues.",
    takeLabel: "For Friday", take: "The steps for people building in Copilot Pages.",
    asks: ["sharing", "tools"]
  },
  {
    id: "sites-embed", section: "moves", group: "The three levels",
    title: "Add Google files, video & more to your site",
    url: "https://support.google.com/sites/answer/90569",
    who: "Google", venue: "Sites Help", when: "as of October 2026", type: "help",
    says: "How to add things to a Google Site, including the Embed option: by URL, or by pasting embed code. The pasted code becomes its own box on the page.",
    takeLabel: "Level 2", take: "Insert, then Embed, then the Embed code tab: the step most people never find.",
    asks: ["tools", "sharing"]
  },
  {
    id: "apps-script-overview", section: "moves", group: "The three levels",
    title: "Google Apps Script overview",
    url: "https://developers.google.com/apps-script/overview",
    who: "Google", venue: "Google for Developers", when: "as of October 2026", type: "help",
    says: "What Apps Script is: a JavaScript platform built into Google Workspace, with built-in services for Drive, Sheets, Docs, Gmail, and Calendar, run from script.google.com with nothing to install.",
    takeLabel: "Level 3", take: "The whole of level 3 lives here, in the account you already have.",
    asks: ["tools", "code"]
  },
  {
    id: "apps-script-authorization", section: "moves", group: "The three levels",
    title: "Authorization for Google services",
    url: "https://developers.google.com/apps-script/guides/services/authorization",
    who: "Google", venue: "Google for Developers", when: "as of October 2026", type: "help",
    says: "Why a script asks for permission the first time it runs, how the scopes it asks for come from the services it calls, and what the authorization screen shows.",
    takeLabel: "The habit", take: "The permission screen is the gate. Read it like a permission slip, every time.",
    asks: ["security", "code"]
  },
  {
    id: "apps-script-driveapp", section: "moves", group: "The three levels",
    title: "Class DriveApp",
    url: "https://developers.google.com/apps-script/reference/drive/drive-app",
    who: "Google", venue: "Google for Developers", when: "as of October 2026", type: "help",
    says: "The reference for the Drive service a script uses to find folders and files: getFolderById, getFiles, getFolders, and each file's name, type, and link.",
    takeLabel: "Level 3", take: "Every line of the inventory script is explained here, if you want to see for yourself.",
    asks: ["code"]
  },
  {
    id: "claude-code-overview", section: "moves", group: "The three levels",
    title: "Claude Code overview",
    url: "https://code.claude.com/docs/en/overview",
    who: "Anthropic", venue: "Claude Code documentation", when: "as of October 2026", type: "help",
    says: "A coding tool that works inside a folder of files: it reads, edits, runs, and tests code from a terminal or a desktop app, and asks before it acts.",
    takeLabel: "Later", take: "The workbench. This site was built with it. When level three feels easy.",
    asks: ["tools"]
  },
  {
    id: "codex-overview", section: "moves", group: "The three levels",
    title: "Codex",
    url: "https://developers.openai.com/codex",
    who: "OpenAI", venue: "OpenAI for Developers", when: "as of October 2026", type: "help",
    says: "OpenAI's coding tool, in the terminal, an editor, or the cloud, working across a whole project.",
    takeLabel: "Later", take: "The other workbench. Same idea, different vendor.",
    asks: ["tools"]
  },
  {
    id: "mdn", section: "moves", group: "What the code is",
    title: "Your first website",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website",
    who: "Mozilla", venue: "MDN Web Docs", when: "as of October 2026", type: "learning",
    says: "Plain definitions of the three languages of the web: HTML gives a page its structure, CSS its look, and JavaScript its behavior. It then walks through building and publishing a first page.",
    takeLabel: "For Friday", take: "These three languages are in every file the AI writes, including the starters. Open one with \"Show the code\" and you'll see all three.",
    asks: ["code", "starting"]
  },
  {
    id: "anthropic-course", section: "moves", group: "What the code is",
    title: "AI capabilities and limitations",
    url: "https://academy.claude.com/courses/ai-capabilities-and-limitations",
    who: "Anthropic", venue: "Anthropic Academy", when: "as of October 2026", type: "learning",
    says: "Thirteen short lessons, about three and a half hours, on how language models produce text, what they know and when, and how to steer them. The stated audience includes educators.",
    takeLabel: "After Friday", take: "For anyone who leaves asking how it did that.",
    asks: ["code"]
  },
  {
    id: "karpathy", section: "moves", group: "Vibe coding, named and bounded",
    title: "The post that named \"vibe coding\"",
    url: "https://x.com/karpathy/status/1886192184808149383",
    who: "Andrej Karpathy", venue: "on X", when: "February 2, 2025", type: "essay",
    says: "Karpathy describes giving in to the AI so fully that you stop looking at the code, accepting its changes and pasting errors back in. He calls it fine for throwaway weekend projects.",
    takeLabel: "For Friday", take: "Names what we'll be doing, and its limits, in the words of the person who coined it.",
    asks: ["code"]
  },
  {
    id: "willison-vibe", section: "moves", group: "Vibe coding, named and bounded",
    title: "Not all AI-assisted programming is vibe coding (but vibe coding rocks)",
    url: "https://simonwillison.net/2025/Mar/19/vibe-coding/",
    who: "Simon Willison", venue: "simonwillison.net", when: "March 19, 2025", type: "essay",
    says: "Willison separates vibe coding, building without reviewing the code, from AI-assisted programming where you could explain every line. His advice: vibe code low-stakes projects, and ask someone experienced to check anything other people will rely on. He also calls it an eye-opening way for beginners to learn.",
    takeLabel: "For Friday", take: "One simple rule for what to build and what to share.",
    asks: ["code", "sharing", "starting"]
  },
  {
    id: "willison-habits", section: "moves", group: "Vibe coding, named and bounded",
    title: "Here's how I use LLMs to help me write code",
    url: "https://simonwillison.net/2025/Mar/11/using-llms-for-code/",
    who: "Simon Willison", venue: "simonwillison.net", when: "March 11, 2025", type: "essay",
    says: "Practical habits from an experienced programmer: give the model context, tell it exactly what you want, test everything it writes, and expect several rounds of revision.",
    takeLabel: "For Friday", take: "Try it, test it, ask again. That's the whole loop.",
    asks: ["starting", "code"]
  },
  {
    id: "ciddl", section: "moves", group: "Going further",
    title: "Vibe coding for special educators: building custom classroom tools without code",
    url: "https://ciddl.org/vibe-coding-for-special-educators-building-custom-classroom-tools-without-code/",
    who: "Philip Garza", venue: "CIDDL", when: "June 30, 2026", type: "learning",
    says: "An educator builds four small classroom tools with Google AI Studio and advises starting small and specific. It stresses FERPA and IDEA obligations and reviewing any tool before using it with students who have IEPs or 504 plans. CIDDL says it was developed under a cooperative agreement with the U.S. Department of Education.",
    takeLabel: "For Friday", take: "Real examples from a colleague, with student-data guardrails built in.",
    asks: ["tools", "privacy", "starting"]
  },
  {
    id: "github-pages", section: "moves", group: "Going further",
    title: "What is GitHub Pages?",
    url: "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages",
    also: [{ label: "Quickstart", url: "https://docs.github.com/en/pages/quickstart" }],
    who: "GitHub", venue: "GitHub Docs", when: "as of October 2026", type: "help",
    says: "Free hosting that turns the HTML, CSS, and JavaScript files in a GitHub repository into a website. This site is published this way.",
    takeLabel: "After Friday", take: "For turning a tool you built into a page you own.",
    asks: ["sharing"]
  },

  // ---------- Proceed with care ----------
  {
    id: "perry", section: "care", group: "When AI writes the code",
    title: "Do users write more insecure code with AI assistants?",
    url: "https://arxiv.org/abs/2211.03622",
    who: "Perry, Srivastava, Kumar & Boneh", venue: "ACM CCS", when: "2023", type: "research", peer: true,
    says: "In a study of 47 participants, those using an AI assistant wrote less secure code and were more likely to believe it was secure. Participants who trusted the AI less and reworked their prompts did better.",
    takeLabel: "The habit", take: "Treat the AI's confidence as a claim to check. Ask it what could go wrong with your tool and where any typed information goes.",
    asks: ["security"]
  },
  {
    id: "pearce", section: "care", group: "When AI writes the code",
    title: "Asleep at the keyboard? Assessing the security of GitHub Copilot's code contributions",
    url: "https://arxiv.org/abs/2108.09293",
    who: "Pearce, Ahmad, Tan, Dolan-Gavitt & Karri", venue: "IEEE Symposium on Security and Privacy", when: "2022", type: "research", peer: true,
    says: "Across 89 scenarios built around high-risk weaknesses, the researchers judged about 40% of 1,689 generated programs to be vulnerable. They tested a 2021 tool on security-sensitive tasks, so this isn't a general error rate.",
    takeLabel: "The habit", take: "Keep Friday's tools simple: no logins, no passwords, no storing other people's information.",
    asks: ["security"]
  },
  {
    id: "spracklen", section: "care", group: "When AI writes the code",
    title: "We have a package for you! A comprehensive analysis of package hallucinations by code generating LLMs",
    url: "https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen",
    who: "Spracklen and colleagues", venue: "USENIX Security", when: "2025", type: "research", peer: true,
    says: "Across 16 models and 576,000 code samples, models invented software packages that don't exist, on average at least 5.2% of the time for commercial models and 21.7% for open-source models.",
    takeLabel: "The habit", take: "Build tools that run right in the AI's preview. If the AI tells you to install something, check with your IT team first.",
    asks: ["security"]
  },
  {
    id: "ptac", section: "care", group: "Student data",
    title: "Protecting student privacy while using online educational services",
    url: "https://studentprivacy.ed.gov/resources/protecting-student-privacy-while-using-online-educational-services-requirements-and-best",
    who: "U.S. Department of Education", venue: "Privacy Technical Assistance Center", when: "2014", type: "policy",
    says: "As a general rule, schools can't share personal information from education records with a provider without parent consent unless a FERPA exception applies. Clicking \"accept\" on terms of service is like signing a contract, and free tools should go through the same approval as paid ones. It predates generative AI and is still posted as current guidance.",
    takeLabel: "The habit", take: "Know your district's approval process before real student information goes into any tool.",
    asks: ["privacy"]
  },
  {
    id: "fpf-vetting", section: "care", group: "Student data",
    title: "Vetting generative AI tools for use in schools",
    url: "https://fpf.org/wp-content/uploads/2024/10/Ed_AI_legal_compliance.pdf_FInal_OCT24.pdf",
    who: "David Sallay", venue: "Future of Privacy Forum", when: "2024", type: "policy",
    says: "A student ID number or a school email address still counts as personal information under FERPA and many state laws. Schools should ask whether a vendor uses student information to train its models.",
    takeLabel: "The habit", take: "Use made-up names and made-up data. Initials and ID numbers don't make data anonymous.",
    asks: ["privacy"]
  },
  {
    id: "mn-1332", section: "care", group: "Student data",
    title: "Minnesota Statutes § 13.32, educational data",
    url: "https://www.revisor.mn.gov/statutes/cite/13.32",
    also: [{ label: "Laws 2022, chapter 69", url: "https://www.revisor.mn.gov/laws/2022/0/69/" }],
    who: "Minnesota Office of the Revisor of Statutes", venue: "Minnesota Statutes", when: "amended 2022", type: "policy",
    says: "The 2022 amendments say educational data held by a technology provider isn't the provider's property, can't be used commercially, and must be returned or destroyed within 90 days after a contract ends. Schools must tell parents which providers have access within 30 days of the start of the school year. The law defines technology providers around contracts for school-issued devices, so whether it reaches a particular AI tool is a question for your district.",
    takeLabel: "The habit", take: "Ask your district's data practices contact before any tool touches real student records.",
    asks: ["privacy"]
  },
  {
    id: "mde", section: "care", group: "Student data",
    title: "Artificial intelligence in education",
    url: "https://education.mn.gov/MDE/dse/tech/AI/AIEd/",
    who: "Minnesota Department of Education", venue: "education.mn.gov", when: "as of October 2026", type: "policy",
    says: "Asks educators how data is collected and used and whether a tool meets data practices standards, names over-reliance as a challenge, and names designing and innovating with AI as an opportunity.",
    takeLabel: "The habit", take: "Run your tool idea through MDE's questions before you share it.",
    asks: ["privacy", "learning"]
  },
  {
    id: "ada-rule", section: "care", group: "Accessibility of what you share",
    title: "Fact sheet: new rule on the accessibility of web content and mobile apps",
    url: "https://www.ada.gov/resources/2024-03-08-web-rule/",
    who: "U.S. Department of Justice", venue: "ADA.gov", when: "rule 2024, dates extended April 2026", type: "policy",
    says: "State and local governments, including school districts, must meet WCAG 2.1 Level AA for their web content and apps. An interim final rule on April 20, 2026 moved the compliance dates to April 26, 2027 for entities serving 50,000 people or more, and April 26, 2028 for smaller ones and special districts. A lawsuit challenging the extension was filed in May 2026, according to a law firm's summary; we found no ruling as of October 7.",
    takeLabel: "The habit", take: "Before a tool goes on a public district page, check that it works by keyboard, has readable contrast, and labels its controls.",
    asks: ["access", "sharing"]
  },
  {
    id: "w3c-easy-checks", section: "care", group: "Accessibility of what you share",
    title: "Easy checks: a first review of web accessibility",
    url: "https://www.w3.org/WAI/test-evaluate/easy-checks/",
    also: [{ label: "WCAG 2.1", url: "https://www.w3.org/TR/WCAG21/" }],
    who: "W3C Web Accessibility Initiative", venue: "w3.org", when: "as of October 2026", type: "policy",
    says: "WCAG is organized around four principles: perceivable, operable, understandable, and robust. Easy Checks is a quick first look, and W3C notes that a page can pass it and still have real barriers.",
    takeLabel: "The habit", take: "Ask your AI to make the tool meet WCAG 2.1 AA, then run Easy Checks and try it with only a keyboard.",
    asks: ["access", "sharing"]
  },
  {
    id: "bastani", section: "care", group: "Learning and over-reliance",
    title: "Generative AI without guardrails can harm learning: evidence from high school mathematics",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/",
    who: "Bastani, Bastani, Sungu, Ge, Kabakcı & Mariman", venue: "PNAS", when: "2025", type: "research", peer: true,
    says: "In a field experiment with nearly 1,000 high school students, access to GPT-4 raised practice scores (by 48% with a standard chat, 127% with a tutor version built with guardrails). When access was taken away, the standard-chat group did 17% worse than students who never had it. The guardrails largely prevented that harm.",
    takeLabel: "The habit", take: "If you build something for students, have it give hints and questions, not answers.",
    asks: ["learning"]
  },
  {
    id: "lee-chi", section: "care", group: "Learning and over-reliance",
    title: "The impact of generative AI on critical thinking",
    url: "https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/",
    who: "Lee, Sarkar, Tankelevitch, Drosos, Rintel, Banks & Wilson", venue: "CHI", when: "2025", type: "research", peer: true,
    says: "In a survey of 319 knowledge workers describing 936 tasks, higher confidence in AI went with less critical thinking. The data are self-reported and show an association, not a cause.",
    takeLabel: "The habit", take: "Build in a check step. Click every button and confirm every fact your tool shows.",
    asks: ["learning"]
  },
  {
    id: "widening-gap", section: "care", group: "Learning and over-reliance",
    title: "The widening gap: the benefits and harms of generative AI for novice programmers",
    url: "https://arxiv.org/abs/2405.17739",
    who: "Prather and colleagues", venue: "ICER", when: "2024", type: "research", peer: true,
    says: "Across 21 lab sessions, students who struggled often believed they had done better than they had, leaving with an illusion of competence.",
    takeLabel: "The habit", take: "Explain your tool back in your own words. If you can't, ask the AI to walk you through it.",
    asks: ["learning", "starting"]
  },
  {
    id: "kosmyna", section: "care", group: "Learning and over-reliance",
    title: "Your brain on ChatGPT",
    url: "https://arxiv.org/abs/2506.08872",
    who: "Kosmyna and colleagues", venue: "MIT Media Lab, arXiv", when: "2025", type: "preprint",
    says: "A widely shared study that hadn't been peer-reviewed as of its December 2025 version. It had 54 participants, 18 of whom completed the fourth session.",
    takeLabel: "The habit", take: "Read it as early and unreviewed, and check whether a study has been peer-reviewed before you quote it.",
    asks: ["learning"]
  },

  // ---------- Coding and thinking ----------
  {
    id: "scherer-2019", section: "thinking", group: "Does learning to code help thinking?",
    title: "The cognitive benefits of learning computer programming: a meta-analysis of transfer effects",
    url: "https://doi.org/10.1037/edu0000314",
    who: "Scherer, Siddiq & Sánchez Viveros", venue: "Journal of Educational Psychology", when: "2019", type: "research", peer: true,
    says: "Across 105 studies and 539 effect sizes, learning to program had a moderate overall effect (g = 0.49): strong on programming itself (g = 0.75) and moderate on other thinking skills (g = 0.47). Gains were strongest for creative thinking, math, and metacognition, then spatial skills and reasoning, and smallest for school achievement and literacy. Compared with other active training, the effect was g = 0.16; compared with no training, g = 0.65.",
    takeLabel: "For Friday", take: "Call it problem-solving practice, not a promise that coding makes people smarter.",
    asks: ["thinking", "assessment"]
  },
  {
    id: "denning", section: "thinking", group: "Does learning to code help thinking?",
    title: "Remaining trouble spots with computational thinking",
    url: "https://cacm.acm.org/research/remaining-trouble-spots-with-computational-thinking/",
    who: "Peter Denning", venue: "Communications of the ACM", when: "2017", type: "essay",
    says: "Denning argues that claims of computational thinking helping everyone, beyond people who design computing systems, remain unsupported, and that research hasn't shown general transfer. He wrote before the 2019 meta-analysis, which found some transfer, though weaker against active comparisons.",
    takeLabel: "For Friday", take: "A reason to keep our claims modest.",
    asks: ["thinking"]
  },
  {
    id: "scherer-2020", section: "thinking", group: "Does learning to code help thinking?",
    title: "A meta-analysis of teaching and learning computer programming: effective instructional approaches and conditions",
    url: "https://doi.org/10.1016/j.chb.2020.106349",
    who: "Scherer, Siddiq & Sánchez Viveros", venue: "Computers in Human Behavior", when: "2020", type: "research", peer: true,
    says: "Across 139 interventions, programming instruction had a strong effect (g = 0.81). Teaching approaches differed only a little from each other, with collaboration and visual programming standing out.",
    takeLabel: "For Friday", take: "No one method wins, so the design can choose for agency and collaboration: teams of four, an anchor, and building along.",
    asks: ["thinking", "starting"]
  },
  {
    id: "wing", section: "thinking", group: "Where the ideas come from",
    title: "Computational thinking",
    url: "https://www.cs.cmu.edu/~wing/publications/Wing06.pdf",
    who: "Jeannette Wing", venue: "Communications of the ACM", when: "2006", type: "essay",
    says: "Wing argues that computational thinking, built on abstraction and breaking problems down, is a basic skill for everyone. It's about how people conceptualize problems, not about programming, and it's a way humans think, not a way of making people think like computers.",
    takeLabel: "For Friday", take: "The thinking stays human, even when AI writes the code.",
    asks: ["thinking"]
  },
  {
    id: "papert", section: "thinking", group: "Where the ideas come from",
    title: "Mindstorms: children, computers, and powerful ideas",
    url: "https://www.hachettebookgroup.com/titles/seymour-a-papert/mindstorms/9781541675124/",
    who: "Seymour Papert", venue: "Basic Books", when: "1980", type: "book",
    says: "Drawing on children's work with the Logo programming language, Papert argues that children can master computers, and that ideas like debugging can change how people learn in general. It's vision and theory rather than controlled evidence; Grover and Pea credit it with pioneering the idea that children build procedural thinking through programming.",
    takeLabel: "For Friday", take: "Building your own tool comes from this tradition.",
    asks: ["thinking", "starting"]
  },
  {
    id: "brennan-resnick", section: "thinking", group: "Where the ideas come from",
    title: "New frameworks for studying and assessing the development of computational thinking",
    url: "https://scratched.gse.harvard.edu/ct/files/AERA2012.pdf",
    who: "Karen Brennan & Mitchel Resnick", venue: "AERA Annual Meeting", when: "2012", type: "research",
    says: "Computational thinking has three parts: concepts (like loops, events, and conditions), practices (like testing and debugging, and reusing and remixing), and perspectives (like expressing and questioning). For assessing it, they suggest making assessment useful to the learner, including what learners made, showing the process, checking in more than once, valuing different ways of knowing, and including several viewpoints.",
    takeLabel: "For Friday and November", take: "Remixing is a named practice, and these assessment suggestions lead straight into next month.",
    asks: ["thinking", "assessment", "starting"]
  },
  {
    id: "grover-pea", section: "thinking", group: "Where the ideas come from",
    title: "Computational thinking in K–12: a review of the state of the field",
    url: "https://doi.org/10.3102/0013189X12463051",
    who: "Shuchi Grover & Roy Pea", venue: "Educational Researcher", when: "2013", type: "research", peer: true,
    says: "A review recommending tools with a low floor and a high ceiling, plus scaffolding. It flags open questions about transfer to other subjects and how to measure what learners gain.",
    takeLabel: "For Friday", take: "The starters are the low floor; granting a wish from scratch is the high ceiling.",
    asks: ["thinking", "starting", "assessment"]
  },
  {
    id: "use-modify-create", section: "thinking", group: "How to start: run, change, make",
    title: "Computational thinking for youth in practice",
    url: "https://users.soe.ucsc.edu/~linda/pubs/ACMInroads.pdf",
    who: "Lee, Martin, Denner, Coulter, Allan, Erickson, Malyn-Smith & Werner", venue: "ACM Inroads", when: "2011", type: "research",
    says: "Proposes Use-Modify-Create: learners use someone else's program, change it (first how it looks, then how it behaves) until it becomes their own, and then create their own. The authors note that learners move back and forth between stages.",
    takeLabel: "For Friday", take: "Play a starter, change it, remix it, grant a wish. That's Use-Modify-Create.",
    asks: ["starting"]
  },
  {
    id: "primm", section: "thinking", group: "How to start: run, change, make",
    title: "Teaching computer programming with PRIMM: a sociocultural perspective",
    url: "https://doi.org/10.1080/08993408.2019.1608781",
    also: [{ label: "Raspberry Pi Foundation summary", url: "https://www.raspberrypi.org/app/uploads/2022/08/Teaching_Programming_with_PRIMM-1.pdf" }],
    who: "Sentance, Waite & Kallia", venue: "Computer Science Education", when: "2019", type: "research", peer: true,
    says: "PRIMM stands for predict, run, investigate, modify, make. In 13 schools with 493 students aged 11 to 14, the PRIMM group scored higher on a post-test than a comparison group, in a quasi-experimental design. Its principles include reading code before writing it, talking about code together, and starting from working programs.",
    takeLabel: "For Friday", take: "Guess what a starter does before you press Play, and talk about the code with your team.",
    asks: ["starting"]
  },
  {
    id: "kazemitabaar", section: "thinking", group: "AI and beginners",
    title: "Studying the effect of AI code generators on supporting novice learners in introductory programming",
    url: "https://arxiv.org/abs/2302.07427",
    who: "Kazemitabaar, Chow, Ma, Ericson, Weintrop & Grossman", venue: "CHI", when: "2023", type: "research", peer: true,
    says: "In a controlled study of 69 novices aged 10 to 17, AI access raised code-writing performance (1.15 times the completion, 1.8 times the scores) without hurting later tasks where learners changed code by hand. Learners with more prior knowledge gained most, and in 49% of tasks where they used the AI, they submitted its code unchanged.",
    takeLabel: "For Friday", take: "Mix AI remixes with changes you make by hand, and read what the AI made before you keep it.",
    asks: ["learning", "starting"]
  },
  {
    id: "robots-are-here", section: "thinking", group: "AI and beginners",
    title: "The robots are here: navigating the generative AI revolution in computing education",
    url: "https://arxiv.org/abs/2310.00658",
    who: "Prather, Denny, Leinonen, Becker and colleagues", venue: "ITiCSE Working Group Reports", when: "2023", type: "research", peer: true,
    says: "Drawing on a review of 71 articles, a survey of 171 students and 57 instructors in 20 countries, and 22 interviews, the authors found over-reliance was the most common concern. Some educators are shifting to assess process: work submitted in stages, reflections, interviews, portfolios, and presentations.",
    takeLabel: "For November", take: "A direct bridge to next month's conversation about assessment.",
    asks: ["assessment", "learning"]
  },
  {
    id: "denny-2024", section: "thinking", group: "AI and beginners",
    title: "Computing education in the era of generative AI",
    url: "https://cacm.acm.org/research/computing-education-in-the-era-of-generative-ai/",
    who: "Denny, Prather, Becker and colleagues", venue: "Communications of the ACM", when: "2024", type: "research", peer: true,
    says: "AI raises concerns about over-reliance and misuse, and it can also explain code and tailor practice. The authors point to breaking problems down and describing a task precisely as the skills that matter more now, and warn that leaning too hard on code generators may weaken metacognition.",
    takeLabel: "For Friday", take: "Describing what you want clearly enough for an AI to build it is the thinking skill.",
    asks: ["learning", "thinking", "assessment"]
  }
];
