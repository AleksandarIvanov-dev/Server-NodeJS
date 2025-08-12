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
    status: {
        type: String,
        enum: ["not started", "started", "completed"],
        default: "not started"
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },
    sampleInput: String,
    sampleOutput: String
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;