const mongoose = require('mongoose');

const codeExamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
    },
    starterCode: {
        type: String,
    },
    testCases: [
        {
            input: String,
            expectedOutput: String,
        }
    ],
    sampleInput: {
        type: String,
    },
    sampleOutput: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Exam = mongoose.model("codingExam", codeExamSchema);
module.exports = Exam;