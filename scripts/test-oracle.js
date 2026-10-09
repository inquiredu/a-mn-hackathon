// Tests for how the Oracle reads a question: node scripts/test-oracle.js
// The Oracle is one file, so this runs its scripts with a stand-in for the page.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "..", "cabinets", "oracle.html"), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");

// Just enough page for the scripts to load: every element answers every call and remembers nothing
const element = new Proxy({}, { get: (_, name) => (name === "classList" ? { add() {}, remove() {} } : name === "firstElementChild" ? {} : () => {}) });
const context = { document: { getElementById: () => element }, console };
vm.createContext(context);
const share = ["answer", "root", "pick", "choicesIn", "kindOf", "TOPICS", "QUESTION_KINDS", "PROPHECIES", "SILENCE", "EITHER_OR", "MANNERS"];
vm.runInContext(scripts + "\n" + share.map((name) => "this." + name + " = " + name + ";").join(""), context, { filename: "cabinets/oracle.html" });
const { answer, root, pick, choicesIn, kindOf, TOPICS, QUESTION_KINDS, PROPHECIES, SILENCE, EITHER_OR, MANNERS } = context;

const topic = (word, kind = "prophecies") => TOPICS.find((t) => t.listensFor.includes(word))[kind];
const kind = (word) => QUESTION_KINDS.find((k) => k.firstWords.includes(word)).answers;
const oneOf = (list, text, why) => assert.ok(list.includes(text), why + ": got \"" + text + "\"");
const same = (a, b, why) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b), why);   // arrays from the page's own realm

// Roots: plurals and endings fold together, short words stay whole
assert.strictEqual(root("copiers"), root("copier"));
assert.strictEqual(root("copies"), root("copy"));
assert.strictEqual(root("copying"), root("copy"));
assert.strictEqual(root("grading"), root("grade"));
assert.strictEqual(root("graded"), root("grades"));
assert.strictEqual(root("meetings"), root("meeting"));
assert.strictEqual(root("classes"), root("class"));
assert.strictEqual(root("coffees"), root("coffee"));
assert.strictEqual(root("kids"), "kid");
assert.notStrictEqual(root("kidding"), "kid", "kidding is not kids");
assert.notStrictEqual(root("subject"), root("sub"));
assert.notStrictEqual(root("teach"), root("tea"));
assert.strictEqual(root("is"), "is");
assert.strictEqual(root("yes"), "yes");
assert.strictEqual(root("boss"), "boss");

// 1. Silence
oneOf(SILENCE, answer(""), "an empty question");
oneOf(SILENCE, answer("   ?!"), "punctuation alone");

// 2. Manners, only when short
oneOf(MANNERS[0].answers, answer("Hello there"), "a greeting");
oneOf(MANNERS[1].answers, answer("Thank you, Oracle"), "a thank-you");
oneOf(topic("copier"), answer("Hi, will the copier work today?"), "a long question that opens with hi is still a question");

// 3. Either/or
same(choicesIn("Pizza or hotdish?"), ["Pizza", "hotdish"]);
same(choicesIn("Should I grade essays or watch TV tonight?"), ["essays", "watch TV tonight"]);
same(choicesIn("Will it snow or will it rain?"), ["snow", "rain"], "two whole clauses, minus their openers");
same(choicesIn("Will the copiers work today or should I just give up?"), ["the copiers work today", "just give up"], "a noun subject stays");
same(choicesIn("Is it Thursday or is it Friday?"), ["Thursday", "Friday"]);
assert.strictEqual(choicesIn("Will it or will it?"), null, "clauses with nothing left in them are not choices");
same(choicesIn("Tea, coffee, or pop?"), ["coffee", "pop"], "a comma before 'or' is dropped");
same(choicesIn("Oregon or bust"), ["Oregon", "bust"]);
assert.strictEqual(choicesIn("Is the copier working or not?"), null, "'or not' is not a choice");
assert.strictEqual(choicesIn("or"), null);
assert.strictEqual(choicesIn("Will the orchestra play?"), null, "'or' inside a word is not a choice");
const picked = answer("Pizza or hotdish?");
assert.ok(/^(Pizza|Hotdish)[.,]/.test(picked), "either/or names a side, capitalized: " + picked);
assert.ok(EITHER_OR.some((t) => picked.endsWith(t.slice("{choice}".length))), "and uses an EITHER_OR line");
oneOf(topic("copier"), answer("Is the copier working or not?"), "'or not' falls through to the topic");

// 4. Topics: the most-mentioned wins, then the last-mentioned
oneOf(topic("copier"), answer("Will the copiers work today?"), "a plural matches its topic");
oneOf(topic("grade"), answer("Will I ever finish grading?"), "an -ing form matches its topic");
oneOf(topic("coffee"), answer("Is there coffee in the lounge today?"), "two words from one topic");
oneOf(topic("copier"), answer("Will the kids break the copier?"), "a tie goes to the topic mentioned last");
oneOf(topic("kid"), answer("Will the copier survive my kids and their homework?"), "two mentions beat one");

// 4b. A topic answers in the kind of question asked, when it has such a list
oneOf(topic("lunch", "what"), answer("What's for lunch"), "a what-question about lunch names a food");
oneOf(topic("lunch", "what"), answer("Whats for lunch?"), "without the apostrophe too");
oneOf(topic("copier", "when"), answer("When will the copier work?"), "a when-question about the copier names a time");
oneOf(topic("sub", "who"), answer("Who's the sub tomorrow?"), "a who-question about the sub names a person");
oneOf(topic("copier"), answer("Will the copier work today?"), "a yes-or-no question takes the topic's prophecies");
oneOf(topic("friday"), answer("Why is Friday so far away?"), "a kind the topic hasn't got falls back to its prophecies");
assert.strictEqual(kindOf(["what's", "for", "lunch"]).kind, "what");
assert.strictEqual(kindOf(["honestly", "though", "when"]).kind, "when");
assert.strictEqual(kindOf(["lanyard"]), null);

// 5. Kinds, then 6. classics
oneOf(kind("when"), answer("When does the bell ring?"), "a when-question");
oneOf(kind("will"), answer("Will it be okay?"), "a will-question");
oneOf(kind("why"), answer("Honestly, why me?"), "a kind word within the first three");
oneOf(kind("what"), answer("What's the point?"), "a what-question with no topic");
oneOf(PROPHECIES, answer("Lanyard."), "anything else gets a classic");

// pick: everything once before anything repeats, and never the same thing twice running
const list = ["a", "b", "c", "d"];
same([pick(list), pick(list), pick(list), pick(list)].sort(), list, "the first four picks are the four items");
let previous = pick(list);
for (let i = 0; i < 500; i++) { const next = pick(list); assert.notStrictEqual(next, previous, "never the same twice running"); previous = next; }
assert.strictEqual(pick(["only"]), "only", "a one-item list still answers");

console.log("The Oracle reads questions as it should.");
