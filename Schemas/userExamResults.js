const mongoose = require('mongoose');

const userExamResultsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    language: String,
    answers: Object,
    correctCount: Number,
    totalQuestions: Number,
    tutorialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutorials',
        required: true
    },
    completedAt: Date,
    isCompleted: Boolean,
});

const UserExamResults = mongoose.model("usersexamresults", userExamResultsSchema);

module.exports = UserExamResults;