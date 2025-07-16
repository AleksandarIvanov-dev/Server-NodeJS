const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    starterCode: String,
    language: String,
    languageForDisplay: String,
    testCases: [
        {
            input: String,
            expectedOutput: String
        }
    ],
    sampleInput: String,
    sampleOutput: String
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;