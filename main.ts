// One Line, No Deadline Met — a single-line joke excusing a missed
// deadline, capped at 200 characters. One sentence, reads cleanly aloud,
// punch at the end, and it sounds like something a person would actually
// say. Writes /output/entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

const EXCUSE =
  "I missed the deadline because my calendar reminded me three times, and each time I confidently snoozed it like it was only a suggestion.";

const validator = {
  text: EXCUSE.replace(/\s+/g, " ").trim(),
  get length() {
    return [...this.text].length;
  },
  check() {
    if (this.length < 1 || this.length > LIMIT) {
      throw new Error(`entry must be 1-${LIMIT} chars, got ${this.length}`);
    }
    if (this.text.includes("\n") || this.text.includes("\r")) {
      throw new Error("entry must be a single line");
    }
    // One sentence, one excuse: a second period would be a second sentence.
    const sentences = this.text.split(".").filter((s) => s.trim().length > 0);
    if (sentences.length !== 1) {
      throw new Error("entry must be a single sentence");
    }
    if (!/deadline/i.test(this.text)) {
      throw new Error("entry must excuse a missed deadline");
    }
    // The mechanism is the joke: the calendar warned, the human snoozed.
    if (!/calendar/i.test(this.text) || !/snoozed/i.test(this.text)) {
      throw new Error("entry must name the reminder and the snooze");
    }
  },
};

validator.check();
const target = join(OUTPUT_DIR, "entry.txt");
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, validator.text + "\n", "utf8");
console.log(`${validator.length} chars -> ${target}`);
console.log(validator.text);
