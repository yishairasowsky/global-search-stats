/**
 * Generate a DICTIONARY-REALISTIC dataset
 * - Evenly balanced across A–Z
 * - Evenly balanced across AA–AZ, BA–BZ sub-buckets
 * - Prevents empty letters and single-bucket letters
 * - Illusion-safe for dictionary UI
 */

const fs = require("fs");

const INPUT_FILE = "words.txt";   // one word per line
const OUTPUT_FILE = "words.json";

// Controls realism (safe defaults)
const PER_LETTER_LIMIT = 260;
const PER_SUBBUCKET_LIMIT = 80;

// --- Load & sanitize input ---
const raw = fs.readFileSync(INPUT_FILE, "utf8")
  .split(/\r?\n/)
  .map(w => w.trim().toLowerCase())
  .filter(w =>
    w.length >= 6 &&
    w.length <= 40 &&
    /^[a-z][a-z\-']+$/.test(w)
  );

// --- Build A–Z → AA–AZ buckets ---
const buckets = {};
for (let c = 97; c <= 122; c++) {
  const letter = String.fromCharCode(c);
  buckets[letter] = {};
  for (let d = 97; d <= 122; d++) {
    buckets[letter][letter + String.fromCharCode(d)] = [];
  }
}

// --- Distribute words into sub-buckets ---
for (const w of raw) {
  const l1 = w[0];
  const l2 = w[1] || l1;
  if (
    buckets[l1] &&
    buckets[l1][l1 + l2] &&
    buckets[l1][l1 + l2].length < PER_SUBBUCKET_LIMIT
  ) {
    buckets[l1][l1 + l2].push(w);
  }
}

// --- Flatten with per-letter caps ---
const finalWords = [];

for (const letter of Object.keys(buckets).sort()) {
  let collected = [];

  for (const sub of Object.keys(buckets[letter])) {
    collected.push(...buckets[letter][sub]);
  }

  collected = collected
    .sort()
    .slice(0, PER_LETTER_LIMIT);

  finalWords.push(...collected);
}

// --- Write output ---
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(finalWords, null, 2),
  "utf8"
);

// --- Report ---
console.log("✅ Dictionary dataset generated");
console.log("Letters:", Object.keys(buckets).length);
console.log("Total words:", finalWords.length);
console.log("Per letter limit:", PER_LETTER_LIMIT);
console.log("Per sub-bucket limit:", PER_SUBBUCKET_LIMIT);
