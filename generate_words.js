/**
 * Generate a REALISTIC dictionary dataset:
 * - Uses a high-quality frequency list
 * - Filters common but interesting words
 * - Balanced across A–Z
 */
const RARE_LETTERS = new Set(["k", "q", "x", "y", "z"]);

const RARE_MIN_LEN = 5;
const NORMAL_MIN_LEN = 6;

const RARE_FREQ_BOOST = 12000; // reach a bit deeper for rare letters

const fs = require("fs");

const INPUT_WORDS = "words.txt";           
const FREQUENCY_FILE = "word_frequency.txt"; 
const OUTPUT_FILE = "words.json";

// Frequency bounds
const MIN_FREQ_INDEX = 50;   // skip super-common function words
const MAX_FREQ_INDEX = 9000; // include only top ~9000

const PER_LETTER_LIMIT = 1800;

// Words to ignore (basic stopwords)
const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "which",
  "not", "but", "are", "was", "were", "have", "has", "had"
]);

// Read our raw dictionary
const rawWords = new Set(
  fs.readFileSync(INPUT_WORDS, "utf8")
    .split(/\r?\n/)
    .map(w => w.trim().toLowerCase())
    .filter(w => /^[a-z]+$/.test(w))
);

// Load frequency list
const freqWords = fs.readFileSync(FREQUENCY_FILE, "utf8")
  .split(/\r?\n/)
  .map(w => w.trim().toLowerCase());

// Filter for presence in raw dictionary, reasonable length
const filtered = freqWords.filter((w, i) => {
  if (!rawWords.has(w)) return false;
  if (STOPWORDS.has(w)) return false;

  const first = w[0];
  const isRare = RARE_LETTERS.has(first);

  const maxIndex = isRare
    ? MAX_FREQ_INDEX + RARE_FREQ_BOOST
    : MAX_FREQ_INDEX;

  const minLen = isRare
    ? RARE_MIN_LEN
    : NORMAL_MIN_LEN;

  return (
    i >= MIN_FREQ_INDEX &&
    i <= maxIndex &&
    w.length >= minLen &&
    w.length <= 11
  );
});

// Bucket by first letter
const buckets = {};
for (let c = 97; c <= 122; c++) {
  buckets[String.fromCharCode(c)] = [];
}

for (const w of filtered) {
  const l = w[0];
  if (buckets[l] && buckets[l].length < PER_LETTER_LIMIT) {
    buckets[l].push(w);
  }
}

// Flatten sorted
const finalWords = Object.keys(buckets)
  .sort()
  .flatMap(l => buckets[l].sort());

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(finalWords, null, 2),
  "utf8"
);

console.log("✔ Dictionary dataset generated!");
console.log("Total words:", finalWords.length);
console.log("Used freq range:", MIN_FREQ_INDEX, "to", MAX_FREQ_INDEX);
