const fs = require('fs');
const path = require('path');

// Load vocabulary.json
const vocabularyPath = path.join(__dirname, '..', 'assets', 'vocabulary.json');
const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));

// Load streets.json
const streetPath = path.join(__dirname, 'assets', 'streets.json');
const local = JSON.parse(fs.readFileSync(streetPath, 'utf8'));

// Fields to retain
const fieldsToKeep = ['sv', 'en', 'literal', 'img'];

// Function to resolve an ID to text fields
function mappedId(id) {
  const entry = vocabulary[id];
  if (!entry) return id; // return untouched if not found

  const resolved = { id };
  fieldsToKeep.forEach(field => {
    if (entry[field]) {
      resolved[field] = entry[field];
    }
  });
  return resolved;
}

// Recursive function to traverse and resolve only vocabulary IDs
function mappedValues(obj) {
  if (typeof obj === 'string') {
    // Replace only if it exists in vocabulary
    return vocabulary[obj] ? mappedId(obj) : obj;
  } else if (Array.isArray(obj)) {
    return obj.map(mappedValues);
  } else if (obj && typeof obj === 'object') {
    const mappedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      mappedObj[key] = mappedValues(value);
    }
    return mappedObj;
  }
  return obj; // primitives untouched
}

// Traverse streets.json
const resolvedLocal = mappedValues(local);

// Save to a new file
const outputPath = path.join(__dirname, 'assets', 'team16_vocab.json');
fs.writeFileSync(outputPath, JSON.stringify(resolvedLocal, null, 2));

console.log('Resolved streets.json saved to team16_vocab.json');
