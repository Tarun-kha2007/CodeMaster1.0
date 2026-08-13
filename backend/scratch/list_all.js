const main = require('../src/config/db');
const Problem = require('../src/models/problem');

async function listAll() {
  await main();
  const probs = await Problem.find({});
  console.log("Total Problems in Database:", probs.length);
  probs.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} (${p.difficulty}) [Companies: ${Array.isArray(p.companies) ? p.companies.join(', ') : p.companies}]`);
  });
  process.exit(0);
}

listAll();
