const mongoose = require('mongoose');

const userExamResultsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exams", required: true },
    language: String,
    answers: Object,
    correctCount: Number,
    totalQuestions: Number,
    completedAt: Date,
    isCompleted: Boolean,
});

const UserExamResults = mongoose.model("usersexamresults", userExamResultsSchema);

module.exports = UserExamResults;