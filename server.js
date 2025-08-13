const express = require('express')
const axios = require('axios')
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const validator = require('validator');


// Schemas
const UserExamResults = require('./Schemas/userExamResults');
const Tutorial = require('./Schemas/tutorialSchema')
const User = require('./Schemas/userSchema');
const Challenge = require('./Schemas/challengeSchema');
const Exam = require('./Schemas/examSchema')


// Initialize the Express application
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use("/Images", express.static(path.join(__dirname, "Images")));

const port = 5000;
const jwtSecretKey = "SECRET_KEY";
app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}`);
})

// Function to that will look for the token in the cookies from the request and validate it
const withAuth = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, jwtSecretKey, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.user = {
                    id: decoded.id,
                    email: decoded.email
                }
                next();
            }
        })
    }
}

// Endpoint to handle code execution requests 
app.post("/executeCode", async (req, res) => {
    const postURL = "https://api.jdoodle.com/v1/execute";

    const { clientId, clientSecret, script, stdin, language, versionIndex, compileOnly } = req.body;

    if (!clientId || !clientSecret || !script || !language || !versionIndex) {
        return res.status(400).json({ error: "Invalid request data. Please provide all required fields." });
    }

    const jsonObject = {
        clientId,
        clientSecret,
        script,
        stdin,
        language,
        versionIndex,
        compileOnly
    };

    try {
        const response = await axios.post(postURL, jsonObject, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("JDoodle API error:", error?.response?.data || error);
        res.status(500).json({ error: "Execution failed", details: error?.response?.data || error.message });
    }
});

const saltRounds = 10;
// Endpoint to save user data
app.post("/createNewUser", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const isStudent = role === "student";

    // Validate the user data
    if (!firstName || !lastName || !email || password === undefined || password === null) {
        return res.status(400).json({ error: "Invalid user data" });
    }

    try {

        let sanitizedEmail = "";
        if (validator.isEmail(email)) {
            sanitizedEmail = validator.normalizeEmail(email);
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ firstName, lastName, email: sanitizedEmail, password: hash, role, progressLevel: "beginner" });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, jwtSecretKey, {
            expiresIn: '1h',
        });

        res.cookie('token', token, { httpOnly: true, }).status(200);

        res.redirect("http://localhost:3000/home/lang")
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ error: "Signup failed" });
    }
});

// Endpoint to authenticate user login
app.post("/logIn", async (req, res) => {
    const { email, password } = req.body;

    let sanitizedEmail = "";
    if (validator.isEmail(email)) {
        sanitizedEmail = validator.normalizeEmail(email);
    }

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const userData = await User.findOne({ email: sanitizedEmail });

        if (!userData) {
            return res.status(404).json({ error: "Invalid email or password" });
        }

        bcrypt.compare(password, userData.password, (err, isMatched) => {
            if (err) {
                console.err(err)
                return res.status(500).json({ error: "Error during password verification" });
            }

            if (!isMatched) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign({ id: userData._id, email: userData.email }, jwtSecretKey, {
                expiresIn: '1h',
            });

            res.cookie('token', token, { httpOnly: true }).status(200).json({
                message: "Login successful",
                user: {
                    email: userData.email,
                    languages: userData.languages,
                    id: userData._id
                }
            });
        })
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Endpoint to update user's preferred language after signing up
app.put("/updateLanguage", withAuth, async (req, res) => {
    const { languages } = req.body;

    if (!languages) {
        return res.status(400).json({ error: "You must choose a programming language!" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: { languages } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Language preference updated", user: updatedUser });
    } catch (error) {
        console.error("Update language error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/updateuser", withAuth, async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Create an object to hold only the fields we intend to update
    const updateFields = {};

    // --- Conditionally validate and add fields to the update object ---

    // Validate and add firstName if it was provided
    if (firstName) {
        // A more flexible validation for names (allows letters, hyphens, apostrophes)
        if (validator.matches(firstName, /^[a-zA-Z'-]+$/)) {
            updateFields.firstName = firstName;
        } else {
            return res.status(400).json({ error: "Invalid first name format." });
        }
    }

    // Validate and add lastName if it was provided
    if (lastName) {
        if (validator.matches(lastName, /^[a-zA-Z'-]+$/)) {
            updateFields.lastName = lastName;
        } else {
            return res.status(400).json({ error: "Invalid last name format." });
        }
    }

    // Validate and add email if it was provided
    if (email) {
        if (validator.isEmail(email)) {
            updateFields.email = validator.normalizeEmail(email);
        } else {
            return res.status(400).json({ error: "Invalid email format." });
        }
    }

    // Hash and add the password only if a new one was provided
    if (password) {
        if (password.length < 8) { // Example: add a password length check
            return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }
        updateFields.password = await bcrypt.hash(password, 10);
    }

    // Check if there are any valid fields to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No valid fields provided for update." });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user.id }, // Find the user by their ID from the auth token
            { $set: updateFields }, // Use the dynamically built object with $set
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Send a clean response without the password
        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        // Handle potential database errors (e.g., unique email constraint violation)
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user. The email might already be in use." });
    }
});

// Endpoint to receive exam results and save them to the database
app.post("/exam/results", withAuth, async (req, res) => {
    const { examId, answers, language, questions, correctCount, totalQuestion } = req.body;
    const userID = req.user.id;
    const userEmail = req.user.email;

    if (!userID) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!examId || !language || !answers || correctCount === undefined || totalQuestion === undefined) {
        return res.status(400).json({ error: "Invalid request data. Please provide all required fields." });
    }

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        const grade = Math.round((correctCount / totalQuestion) * 4) + 2;

        // Save user exam result with examId
        const result = new UserExamResults({
            userId: userID,
            examId,          // Save examId here
            language,
            answers,
            correctCount,
            totalQuestion,
            completedAt: new Date(),
            isCompleted: grade >= 3,
        });
        await result.save();

        // Save summary in user's solvedExams
        user.solvedExams.push({
            examId,          // Link real exam id here
            grade,
            totalQuestions: totalQuestion,
            questions,       // optional, you might want to remove to save space if you have examId
            correctCount,
            allAnswers: Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer
            })),
            submittedAt: new Date()
        });

        user.progressTutorial = user.progressTutorial.filter(item => item.language);
        await user.save();

        // Build response: questions with correct answers + user's answers
        // Map exam questions with user's answers
        const questionsWithUserAnswers = exam.questions.map(q => ({
            questionId: q._id.toString(),
            questionText: q.questionText,
            options: q.options,
            correctAnswers: q.correctAnswers,
            userAnswer: answers[q._id.toString()] || null
        }));

        return res.status(200).json({
            message: "Exam result saved successfully",
            grade: `${grade}`,
            correctCount,
            totalQuestion,
            questions: questionsWithUserAnswers
        });

    } catch (error) {
        console.error("Error saving exam result:", error);
        return res.status(500).json({ error: "Failed to save exam result" });
    }
});

// Endpoint to get answers for a specific exam by ID
app.get("/exam/answers/:examId", withAuth, async (req, res) => {
    const examId = req.params.examId;
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail }).populate({
            path: "solvedExams.examId",
            model: "Exam",
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const solvedExam = user.solvedExams.find(se =>
            se.examId && se.examId._id.toString() === examId
        );
        if (!solvedExam) {
            return res.status(404).json({ error: "Solved exam not found for user" });
        }

        const exam = solvedExam.examId;

        if (!exam || !Array.isArray(exam.questions)) {
            return res.status(500).json({ error: "Exam data is incomplete" });
        }

        // Build user answers map
        const userAnswersMap = {};
        if (Array.isArray(solvedExam.allAnswers)) {
            solvedExam.allAnswers.forEach(({ questionId, answer }) => {
                if (questionId) {
                    userAnswersMap[questionId.toString()] = answer;
                }
            });
        }

        let correctCount = 0;
        const questionsWithUserAnswers = exam.questions.map((q) => {
            const userAnswer = userAnswersMap[q._id.toString()] || null;
            const isCorrect =
                Array.isArray(userAnswer) &&
                Array.isArray(q.correctAnswers) &&
                userAnswer.length === q.correctAnswers.length &&
                userAnswer.every(ans => q.correctAnswers.includes(ans));

            if (isCorrect) correctCount++;

            return {
                questionId: q._id.toString(),
                questionText: q.questionText,
                options: q.options,
                correctAnswers: q.correctAnswers,
                userAnswer,
                isCorrect
            };
        });

        const totalQuestions = exam.questions.length;
        const wrongCount = totalQuestions - correctCount;
        const grade = ((correctCount / totalQuestions) * 4) + 2;

        return res.json({
            examId: exam._id,
            language: exam.language,
            difficulty: exam.difficulty,
            time: exam.time,
            createdAt: exam.createdAt,
            solvedAt: solvedExam.submittedAt,
            totalQuestions,
            correctCount,
            wrongCount,
            grade,
            questions: questionsWithUserAnswers
        });

    } catch (error) {
        console.error("Error fetching exam answers:", error);
        return res.status(500).json({ error: "Failed to fetch exam answers" });
    }
});

// Endpoint to get user data from DB
app.get("/getuserprofile", withAuth, async (req, res) => {
    try {
        const userEmail = req.user.email; // from JWT cookie
        const userData = await User.findOne({ email: userEmail });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        //console.log(userData)
        res.json(userData);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/getuserinfo", withAuth, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userData = await User.findOne({ email: userEmail }).lean();

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const allChallengesByLanguage = await Challenge.find({
            languageForDisplay: { $in: userData.languages }
        });

        const solvedChallengeIds = userData.solvedChallenges.map(item => item.challengeId);
        const challenges = await Challenge.find({ _id: { $in: solvedChallengeIds } }).lean();

        const solvedExamIds = userData.solvedExams.map(item => item.examId);
        const exams = await UserExamResults.find({ _id: { $in: solvedExamIds } }).lean();

        const quizNames = Object.values(userData.namesOfSolvedQuiz || {}).flat();

        res.json({
            userData,
            allChallengesByLanguage,
            challenges,
            exams,
            quizNames
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to check if the router has a valid token
app.get("/checkToken", withAuth, (req, res) => {
    res.sendStatus(200);
})

// Route to logout the current user
app.post("/logout", (req, res) => {
    res.clearCookie("token")
    res.sendStatus(200);
})

// Endpoint to get tutorials based on user's language
app.post("/get-tutorial", withAuth, async (req, res) => {
    const userEmail = req.user.email;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        const tutorials = await Tutorial.find({
            language: { $in: user.languages }
        }).sort({ title: 1 }).limit(3);

        res.status(200).json(tutorials);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});

// Endpoint to save user's progress in a tutorial
app.post("/start-tutorial", withAuth, async (req, res) => {
    const { tutorialName, tutorialLanguage } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    let langEntry = user.progressTutorial.find(entry => entry.language === tutorialLanguage);

    if (!langEntry) {
        langEntry = {
            language: tutorialLanguage,
            tutorials: []
        };
        user.progressTutorial.push(langEntry);
    }

    const alreadyStarted = langEntry.tutorials.find(t => t.tutorialName === tutorialName);

    if (!alreadyStarted) {
        langEntry.tutorials.push({
            tutorialName,
            startedAt: new Date(),
            endedAt: null
        });
        await user.save();
    }

    res.status(200).json({ message: "Tutorial started" });
});

app.post("/end-tutorial", withAuth, async (req, res) => {
    try {
        const { tutorialName, tutorialLanguage } = req.body;
        const userEmail = req.user.email;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!Array.isArray(user.progressTutorial)) {
            return res.status(400).json({ error: "No progress found" });
        }

        const langEntry = user.progressTutorial.find(entry => entry.language === tutorialLanguage);
        if (!langEntry) {
            return res.status(400).json({ error: "No progress for this language" });
        }

        const tutorialProgress = langEntry.tutorials.find(t => t.tutorialName === tutorialName);
        if (!tutorialProgress) {
            return res.status(400).json({ error: "Tutorial not started" });
        }

        if (!tutorialProgress.endedAt) {
            tutorialProgress.endedAt = new Date();
            await user.save();
            return res.status(200).json({ message: "Tutorial ended" });
        } else {
            return res.status(200).json({ message: "Tutorial already ended" });
        }

    } catch (error) {
        console.error("Error in end-tutorial:", error);
        res.status(500).json({ error: "Server error" });
    }
});
// Endpoint to execute user's code from coding challenges
app.post("/execute-code", withAuth, async (req, res) => {
    const { challengeId, code, language, versionIndex } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });
    const challenge = await Challenge.findById(challengeId);

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    if (!challenge) {
        return res.status(404).json({ error: "Challenge not found!" });
    }

    const testResults = await runAllTestCases(challenge.testCases, code, language, versionIndex);

    const allPassed = testResults.every(r => r.passed);

    if (allPassed) {
        const alreadySolved = user.solvedChallenges.some(
            (item) => item.challengeId.toString() === challengeId
        );

        if (!alreadySolved) {
            user.solvedChallenges.push({ challengeId, code });
            await user.save();
        }
    }

    //console.log(allPassed, testResults)

    return res.status(200).json({
        success: allPassed,
        testResults,
        message: allPassed ? "All tests passed!" : "Some tests failed."
    });
});

// Endpoint to track when the user started the challenge
app.post("/start-challenge", withAuth, async (req, res) => {
    const { challengeId } = req.body;
    const user = await User.findOne({ email: req.user.email });

    const exists = user.solvedChallenges.find(p => p.challengeId.toString() === challengeId);

    if (!exists) {
        user.solvedChallenges.push({
            challengeId,
            status: "started",
            startedAt: new Date()
        });
        await user.save();
    }

    res.json({ success: true });
});

// Endpoint to track when the user finished the challenge
app.post("/end-challenge", withAuth, async (req, res) => {
    const { challengeId, code } = req.body;
    const user = await User.findOne({ email: req.user.email });

    const challenge = await Challenge.findById(challengeId);

    const progress = user.solvedChallenges.find(
        (p) => p.challengeId.toString() === challengeId
    );


    if (progress) {
        progress.status = "completed";
        progress.completedAt = new Date();
        progress.code = code;
        progress.difficulty = challenge.difficulty;
    } else {
        user.solvedChallenges.push({
            challengeId,
            difficulty: challenge.difficulty,
            status: "completed",
            solvedAt: new Date(),
            code: code
        });
    }

    user.progressLevel = calculateUserProgressLevel(user.solvedChallenges);

    await user.save();
    res.json({ success: true });
})

// Endpoint to save user's completed Quiz
app.post("/quiz-complete", withAuth, async (req, res) => {
    const { quizName, language } = req.body;
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Вземи вече решените тестове по език
        const quizzes = user.namesOfSolvedQuiz.get(language) || [];

        // Провери дали вече е решен този quiz
        const alreadySolved = quizzes.some(q => q.quizName === quizName);

        if (!alreadySolved) {
            quizzes.push({
                quizName,
                submittedAt: new Date()
            });

            // Обнови map-a с новата стойност
            user.namesOfSolvedQuiz.set(language, quizzes);

            await user.save();
        }

        res.status(200).json({ message: "Quiz progress saved" });

    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint to get all challenges based on user's preferred languages
app.get('/challenges', withAuth, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const user = await User.findOne({ email: userEmail });

        if (!user || !Array.isArray(user.languages)) {
            return res.status(400).json({ error: "User or preferred languages not found." });
        }

        // Map progress level to allowed difficulties
        let allowedDifficulties = [];
        switch (user.progressLevel) {
            case "beginner":
                allowedDifficulties = ["easy"];
                break;
            case "intermediate":
                allowedDifficulties = ["easy", "medium"];
                break;
            case "advanced":
                allowedDifficulties = ["easy", "medium", "hard"];
                break;
            default:
                allowedDifficulties = ["easy"]; // fallback
        }

        const challenges = await Challenge.find({
            languageForDisplay: { $in: user.languages },
            difficulty: { $in: allowedDifficulties }
        }).sort({
            // Optional: show harder first
            difficulty: 1
        });

        res.json(challenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

// Endpoint to get challenge by ID
app.get('/challenge/:id', withAuth, async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });

        res.json(challenge);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching challenge' });
    }
});

// Endpoint to get all exam's based on user's languages
app.get('/get-exams', withAuth, async (req, res) => {
    const userEmail = req.user.email;
    try {
        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const examsByUserLanguage = await Exam.find({ language: { $in: user.languages } })

        res.json(examsByUserLanguage);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Endpoint to save created exam-questions to DB
app.post("/add-exam", withAuth, async (req, res) => {
    const { language, questions, difficulty, examTime } = req.body;
    const isAuthorized = req.user.role;

    //console.log(difficulty)

    if (isAuthorized === "student") {
        return res.status(403).json({ message: "You are not authorized!" });
    }

    try {
        const newExam = new Exam({
            language,
            difficulty,
            questions,
            time: examTime
        });

        await newExam.save();

        res.status(200).json({ message: "Questions added successfully." });

    } catch (error) {
        console.error("Error adding exam questions:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/get-exam/:language", withAuth, async (req, res) => {
    const lang = req.params.language;

    const exams = await Exam.find({ language: lang });
    // Exam.find() returns an array; if no matches, it returns an empty array [] which is truthy.
    if (!exams || exams.length === 0) {
        return res.status(404).json({ message: "No exam with the provided language exists!" });
    }

    // One exam per language
    const exam = exams[0];

    res.json(exam);
});

app.post("/get-tutorials", withAuth, async (req, res) => {
    const userEmail = req.user.email;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        const tutorials = await Tutorial.find({
            language: { $in: user.languages }
        }).sort({ title: 1 });

        res.status(200).json(tutorials);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});
// Function to calculate user's progress level
function calculateUserProgressLevel(solvedChallenges) {
    let easy = 0, medium = 0, hard = 0;

    solvedChallenges.forEach((challenge) => {
        if (challenge.status === 'completed') {
            if (challenge.difficulty === 'easy') easy++;
            else if (challenge.difficulty === 'medium') medium++;
            else if (challenge.difficulty === 'hard') hard++;
        }
    });

    const total = easy + medium + hard;

    if (total < 5 || (easy >= total * 0.8)) {
        return 'beginner';
    } else if (medium >= total * 0.4 || hard >= 1) {
        return 'intermediate';
    } else if (hard >= total * 0.5 || total >= 15) {
        return 'advanced';
    }

    return 'beginner';
}

// Function to run all test cases for a given code snippet
const runAllTestCases = async (testCases, code, language, versionIndex) => {
    const results = [];

    for (const testCase of testCases) {
        try {
            const res = await fetch("https://api.jdoodle.com/v1/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: "740b7e52c332bbbce02cdf69cb87461d",
                    clientSecret: "3b2d3849be5207c8e9354bb38d51100b12867d1f9a94d3e5540b7b821cc91b43",
                    script: code,
                    language: language,
                    versionIndex: versionIndex,
                    stdin: testCase.input,
                }),
            });

            const data = await res.json();
            //console.log(data)

            results.push({
                input: testCase.input,
                expected: testCase.expectedOutput,
                output: data.output?.trim() || "No output",
                passed: data.output?.trim() === testCase.expectedOutput.trim(),
            });

        } catch (err) {
            results.push({
                input: testCase.input,
                expected: testCase.expectedOutput,
                output: `Error: ${err.message}`,
                passed: false,
            });
        }
    }

    return results;
};

// Function to connect to MongoDB
async function connectToDB() {
    //MongoDB connection string
    const dbURI = "mongodb+srv://Aleksandar:zxcvbnmsahko01@educational.t8exfzw.mongodb.net/Users?retryWrites=true&w=majority&appName=Educational"
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongodB!");
    } catch (error) {
        console.error("Error connectiong to the database: ", error)
    }
}

connectToDB();