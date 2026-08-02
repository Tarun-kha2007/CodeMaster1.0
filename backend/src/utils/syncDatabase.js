const mongoose = require('mongoose');
const main = require('../config/db');
const Problem = require('../models/problem');
const User = require('../models/user');

async function syncAndClean() {
  try {
    await main();
    console.log("Connected to MongoDB CodeMaster database...");

    // Remove duplicate "Two Sum" entries without company tags or without description
    const twoSumDocs = await Problem.find({ title: "Two Sum" });
    if (twoSumDocs.length > 1) {
      console.log(`Found ${twoSumDocs.length} Two Sum entries. Cleaning duplicates...`);
      for (const doc of twoSumDocs) {
        if (!Array.isArray(doc.companies) || doc.companies.length === 0) {
          await Problem.findByIdAndDelete(doc._id);
          console.log(`Deleted duplicate incomplete Two Sum document ID: ${doc._id}`);
        }
      }
    }

    // Run bulk seed for CodeMaster database
    require('./seedManyProblems');
    require('./seedMoreBatch');

  } catch (err) {
    console.error("Error syncing database:", err);
    process.exit(1);
  }
}

syncAndClean();
