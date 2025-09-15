const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    languages: {
        type: [String],
    },
    namesOfSolvedQuiz: {
        type: Map,
        of: [
            new mongoose.Schema({
                quizName: String,
                submittedAt: {
                    type: Date,
                    default: Date.now
                }
            },)
        ],
        default: {}
    },
    solvedChallenges: [
        {
            challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
            status: { type: String, enum: ["not started", "started", "completed"], default: "not started" },
            userCode: {
                type: String,
            },
            solvedAt: { type: Date, default: Date.now },
            completedAt: { type: Date },
            difficulty: String
        }
    ],
    solvedExams: [
        {
            examId: { type: mongoose.Schema.Types.ObjectId, ref: "usersexamresults" },
            grade: Number,
            totalQuestions: Number,
            questions: [
                {
                    type: String
                }
            ],
            correctCount: Number,
            allAnswers: [
                {
                    questionId: String,
                    answer: [String]
                }
            ],
            startedAt: { type: Date, default: Date.now },
            submittedAt: { type: Date, default: Date.now }
        }
    ],
    codeExamSolved: [
        {
            codeExamId: { type: mongoose.Schema.Types.ObjectId, ref: "codingExam" },
            code: { type: String },
            title: { type: String },
            language: { type: String },
            submittedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ["pending", "passed", "failed"], default: "pending" },
            score: { type: Number },
            testCasesPassed: { type: Number },
            totalTestCases: { type: Number },
            output: { type: [String] },
        }
    ],
    progressTutorial: [
        {
            language: { type: String},
            tutorials: [
                {
                    tutorialName: { type: String, required: true },
                    startedAt: { type: Date },
                    endedAt: { type: Date },
                    status: {
                        type: String,
                        enum: ['not started', 'started', 'finished'],
                        default: 'not started'
                    }
                }
            ]
        }
    ],
    progressLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;