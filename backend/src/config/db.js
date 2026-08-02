const mongoose = require('mongoose');

async function main() {
    const mongoUri = process.env.MONGODB_URL || "mongodb+srv://tarunkdd24cs:8WCnujySMtfRetTO@codingadda.dfwockq.mongodb.net/CodeMaster";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully");
}

module.exports = main;