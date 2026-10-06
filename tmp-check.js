const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game03/scripts/level1Questions.js', 'utf8');
const sandbox = {
  console,
  Math,
  URLSearchParams,
  window: {
    location: { search: '' },
    save: { get: (g, k) => [] }
  },
  save: { get: (g, k) => [] }
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const result = sandbox.window.getRandomQuestions();
console.log('isArray=', Array.isArray(result));
console.log('length=', result.length);
console.log('sample=', JSON.stringify(result[0]));
