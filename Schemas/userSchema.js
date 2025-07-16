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
    languages: {
        type: [String],
    },
    progress: {
        type: Map,
        of: [String],
        default: {}
    },
    solvedChallenges: [
        {
            challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
            solvedAt: { type: Date, default: Date.now },
            code: String, // optional: store the code that passed
        }
    ]
});

const User = mongoose.model("users", userSchema);

module.exports = User;