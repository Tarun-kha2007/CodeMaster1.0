function parseInput(raw) {
  raw = raw.trim();
  const args = [];
  let current = '';
  let inString = false;
  let bracketDepth = 0;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"' && (i === 0 || raw[i-1] !== '\\')) {
      inString = !inString;
      current += ch;
    } else if (!inString && (ch === '[' || ch === '{')) {
      bracketDepth++;
      current += ch;
    } else if (!inString && (ch === ']' || ch === '}')) {
      bracketDepth--;
      current += ch;
    } else if (!inString && bracketDepth === 0 && (ch === ' ' || ch === '\n' || ch === ',')) {
      if (current.trim().length > 0) {
        const val = current.trim();
        try { args.push(JSON.parse(val)); } catch(e) { args.push(val); }
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) {
    const val = current.trim();
    try { args.push(JSON.parse(val)); } catch(e) { args.push(val); }
  }
  return args;
}

console.log('Test 1:', parseInput('[2,7,11,15] 9'));
console.log('Test 2:', parseInput('[3,2,4] 6'));
console.log('Test 3:', parseInput('[2,7,11,15]\n9'));
console.log('Test 4:', parseInput('"anagram", "nagaram"'));
