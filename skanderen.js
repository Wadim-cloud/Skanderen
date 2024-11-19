const natural = require('natural');
const readline = require('readline');

// Helper function to split a sentence into syllables
function sentenceToSyllables(sentence) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(sentence.toLowerCase());
  return words.flatMap(word => wordToSyllables(word));
}

// Helper function to split a word into syllables
function wordToSyllables(word) {
  const syllablePattern = /[aeiouy]+/g; // Pattern to match vowel groups
  return word.match(syllablePattern) || [];
}

// Function to determine stress pattern (U = unstressed, B = stressed)
function scansion(syllables) {
  return syllables.map(syllable => syllable.length > 1 ? 'B' : 'U');
}

// Function to analyze the meter (skandatie) of a sentence
function detectMeter(syllables) {
  const scansionPattern = scansion(syllables);
  return scansionPattern.join(' '); // Return as a string, e.g., "B U B U"
}

// Function to classify the meter based on the stress pattern
function classifyMeter(pattern) {
  if (pattern === 'B U B U') {
    return 'Iambic (Jambisch)';
  } else if (pattern === 'U B U B') {
    return 'Trochaic (Trocheïsch)';
  } else if (pattern.startsWith('B U U')) {
    return 'Dactylic (Dactylisch)';
  } else if (pattern.startsWith('U U B')) {
    return 'Anapestic (Anapestisch)';
  }
  return 'Unknown meter';
}

// Function to analyze a text (split into sentences, syllables, and meter)
function analyzeText(text) {
  const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
  const results = sentences.map(sentence => {
    const syllables = sentenceToSyllables(sentence);
    const meter = detectMeter(syllables);
    const meterClassification = classifyMeter(meter);
    return {
      sentence,
      meter,
      meterClassification
    };
  });
  return results;
}

// Create an interface for reading input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for text input
rl.question('Voer de tekst in voor analyse (eindig met een punt, vraagteken of uitroepteken):\n', (text) => {
  const analysisResults = analyzeText(text);

  console.log("\nMetrum Analyse Resultaten:");
  analysisResults.forEach(result => {
    console.log(`Zin: ${result.sentence}`);
    console.log(`Skandatie: ${result.meter}`);
    console.log(`Metrum Type: ${result.meterClassification}`);
    console.log('---');
  });

  // Close the readline interface
  rl.close();
});
