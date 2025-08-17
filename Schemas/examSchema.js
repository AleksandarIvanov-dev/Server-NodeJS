const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswers: {
        type: [String],
        required: true
    }
});

const examSchema = new mongoose.Schema({
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
    questions: [questionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;