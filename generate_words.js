/**
 * Generates a dictionary-realistic dataset:
 * - Even coverage across A–Z
 * - Even coverage across the FULL alphabetical range per letter
 * - No bucket UI needed
 */

const fs = require("fs");

const INPUT_FILE = "words.txt";
const OUTPUT_FILE = "words.json";

const PER_LETTER_LIMIT = 2600;
const SLICES = 10; // how many alphabetical slices per letter

const raw = fs.readFileSync(INPUT_FILE, "utf8")
  .split(/\r?\n/)
  .map(w => w.trim().toLowerCase())
  .filter(w =>
    w.length >= 5 &&
    w.length <= 40 &&
    /^[a-z][a-z\-']+$/.test(w)
  );

const byLetter = {};
for (let c = 97; c <= 122; c++) {
  byLetter[String.fromCharCode(c)] = [];
}

for (const w of raw) {
  const l = w[0];
  if (byLetter[l]) byLetter[l].push(w);
}

const finalWords = [];

for (const letter of Object.keys(byLetter)) {
  const words = byLetter[letter].sort();
  if (!words.length) continue;

  const sliceSize = Math.ceil(words.length / SLICES);
  const perSlice = Math.floor(PER_LETTER_LIMIT / SLICES);

  let collected = [];

  for (let i = 0; i < SLICES; i++) {
    const start = i * sliceSize;
    const slice = words.slice(start, start + sliceSize);
    collected.push(...slice.slice(0, perSlice));
  }

  finalWords.push(...collected.sort());
}

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(finalWords, null, 2),
  "utf8"
);

console.log("✅ Dictionary dataset generated");
console.log("Total words:", finalWords.length);