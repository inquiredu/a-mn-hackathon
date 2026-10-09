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
const share = ["answer", "root", "pick", "choicesIn", "kindOf", "echo", "VERDICTS", "SIGN_OFFS", "TOPICS", "QUESTION_KINDS", "PROPHECIES", "SILENCE", "EITHER_OR", "MANNERS"];
vm.runInContext(scripts + "\n" + share.map((name) => "this." + name + " = " + name + ";").join(""), context, { filename: "cabinets/oracle.html" });
const { answer, root, pick, choicesIn, kindOf, echo, VERDICTS, SIGN_OFFS, TOPICS, QUESTION_KINDS, PROPHECIES, SILENCE, EITHER_OR, MANNERS } = context;

const topic = (word, kind = "prophecies") => TOPICS.find((t) => t.listensFor.includes(word))[kind];
const kind = (word) => QUESTION_KINDS.find((k) => k.firstWords.includes(word)).answers;
const oneOf = (list, text, why) => assert.ok(list.includes(text), why + ": got \"" + text + "\"");
const omenFrom = (list, text, why) => assert.ok(list.some((p) => text.endsWith(p)), why + ": got \"" + text + "\"");   // answer() once, then check
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
omenFrom(topic("copier"), answer("Hi, will the copier work today?"), "a long question that opens with hi is still a question");

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
omenFrom(topic("copier"), answer("Is the copier working or not?"), "'or not' falls through to the topic");
assert.strictEqual(echo("Is the copier working or not?", false), "", "an or-question is not turned around");

// 4. Topics: the most-mentioned wins, then the last-mentioned
omenFrom(topic("copier"), answer("Will the copiers work today?"), "a plural matches its topic");
omenFrom(topic("grade"), answer("Will I ever finish grading?"), "an -ing form matches its topic");
omenFrom(topic("coffee"), answer("Is there coffee in the lounge today?"), "two words from one topic");
omenFrom(topic("copier"), answer("Will the kids break the copier?"), "a tie goes to the topic mentioned last");
omenFrom(topic("kid"), answer("Will the copier survive my kids and their homework?"), "two mentions beat one");
omenFrom(topic("copier"), answer("Copier working today?"), "a topic with no opener still gets its prophecy");

// 4. A yes-or-no question: verdict, the question turned around, omen
assert.strictEqual(echo("Will I finish grading tonight?", false), "You will finish grading tonight.");
assert.strictEqual(echo("Will I finish grading tonight?", true), "You will not finish grading tonight.");
assert.strictEqual(echo("Will the copier work today?", false), "The copier will work today.");
assert.strictEqual(echo("Will the new copier work?", false), "The new copier will work.", "a known adjective stays with its noun");
assert.strictEqual(echo("Will my third period behave today?", true), "Your third period will not behave today.");
assert.strictEqual(echo("Will my 3rd period behave?", false), "Your 3rd period will behave.");
assert.strictEqual(echo("Is Donna going to be late?", false), "Donna is going to be late.", "a Name is a subject");
assert.strictEqual(echo("Is Mr. Olson retiring?", true), "Mr. Olson is not retiring.");
assert.strictEqual(echo("Am I going to get a raise?", false), "You are going to get a raise.", "am becomes are with you");
assert.strictEqual(echo("Are you real?", false), "I am real.", "you becomes I, are becomes am");
assert.strictEqual(echo("Are we getting a snow day?", true), "You are not getting a snow day.");
assert.strictEqual(echo("Is there coffee in the lounge?", false), "There is coffee in the lounge.");
assert.strictEqual(echo("Is there coffee in the lounge?", true), "There is no coffee in the lounge.", "there takes no, not not");
assert.strictEqual(echo("Is there going to be a snow day?", true), "There is not going to be a snow day.");
assert.strictEqual(echo("Is this hackathon going to be fun?", false), "This hackathon is going to be fun.");
assert.strictEqual(echo("Is this going to work?", true), "This is not going to work.", "this before an -ing word stands alone");
assert.strictEqual(echo("Does the principal read my emails?", false), "The principal reads your emails.", "does conjugates the verb");
assert.strictEqual(echo("Does the principal read my emails?", true), "The principal does not read your emails.");
assert.strictEqual(echo("Does the copier hate me?", false), "The copier hates you.");
assert.strictEqual(echo("Does Donna have a key?", false), "Donna has a key.");
assert.strictEqual(echo("Does it go away?", false), "It goes away.");
assert.strictEqual(echo("Does she try?", false), "She tries.");
assert.strictEqual(echo("Do I have a meeting?", false), "You have a meeting.");
assert.strictEqual(echo("Do you like me?", true), "I do not like you.");
assert.strictEqual(echo("Can I leave early on Friday?", true), "You cannot leave early on Friday.");
assert.strictEqual(echo("Should I email the parent?", false), "You should email the parent.");
assert.strictEqual(echo("Has the bell rung?", false), "The bell has rung.");
assert.strictEqual(echo("Have I been good?", false), "You have been good.");
assert.strictEqual(echo("Will it snow?", false), "It will snow.");
assert.strictEqual(echo("Did anyone do the homework?", false), "", "did has no safe turn, so no echo");
assert.strictEqual(echo("Will snow?", false), "", "nothing after the subject, no echo");
assert.strictEqual(echo("Lanyard?", false), "");
assert.strictEqual(echo("Will the copier work today or should I give up and go home and cry about it all?", false), "", "too long to echo");
const raise = answer("Am I going to get a raise?");
assert.ok(VERDICTS.some((v) => raise.startsWith(v.says + " You are ")), "verdict, then the turned question: " + raise);
assert.ok(SIGN_OFFS.some((s) => raise.endsWith(s)), "then a sign-off when there is no topic: " + raise);
const coffee = answer("Is there coffee in the lounge?");
assert.ok(/^.+ There is (no )?coffee in the lounge\. /.test(coffee) && topic("coffee").some((p) => coffee.endsWith(p)), "a topic gives the omen: " + coffee);
const no = VERDICTS.filter((v) => v.no).map((v) => v.says);
for (let i = 0; i < 40; i++) { const a = answer("Will the copier work today?"); const negative = no.some((n) => a.startsWith(n)); assert.ok(a.includes(negative ? "The copier will not work today." : "The copier will work today."), "the echo agrees with the verdict: " + a); }

// 4b. A topic answers in the kind of question asked, when it has such a list
oneOf(topic("lunch", "what"), answer("What's for lunch"), "a what-question about lunch names a food");
oneOf(topic("lunch", "what"), answer("Whats for lunch?"), "without the apostrophe too");
oneOf(topic("copier", "when"), answer("When will the copier work?"), "a when-question about the copier names a time");
oneOf(topic("sub", "who"), answer("Who's the sub tomorrow?"), "a who-question about the sub names a person");
oneOf(topic("sub"), answer("Why is the sub late?"), "a kind the topic hasn't got falls back to its prophecies");
assert.strictEqual(kindOf(["what's", "for", "lunch"]).kind, "what");
assert.strictEqual(kindOf(["honestly", "though", "when"]).kind, "when");
assert.strictEqual(kindOf(["lanyard"]), null);

// 5. Kinds, then 6. classics
oneOf(kind("when"), answer("When does the bell ring?"), "a when-question");
assert.ok(/^.+ It will (not )?be okay\. /.test(answer("Will it be okay?")), "a will-question is turned around");
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
