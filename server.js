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
const CodeExam = require('./Schemas/codeExamSchema');


// Initialize the Express application
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.text({ type: "application/json" }));
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
    //const isStudent = role === "student";

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
            expiresIn: "1h"
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

// Endpoint to update user's profile information
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

// Endpoint to evaluate if the user passed the code exam or not
app.post("/coding-exam/results", withAuth, async (req, res) => {
    const { clientId, clientSecret, examId, code, language, versionIndex } = req.body

    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({ error: "User not found!" })
        }

        const exam = await CodeExam.findOne({ _id: examId })

        if (!exam) {
            return res.status(404).json({ error: "Exam not found!" })
        }

        const testResults = await runAllTestCases(clientId, clientSecret, exam.testCases, code, language, versionIndex);

        const allPassed = testResults.every(r => r.passed == true)

        const examResult = {
            codeExamId: exam._id,
            code,
            status: allPassed ? "passed" : "failed",
            title: exam.title,
            submittedAt: new Date(),
            testCasesPassed: testResults.filter(r => r.passed == true).length,
            totalTestCases: exam.testCases.length,
            output: testResults.every(r => r.output) + "\n"
        }

        user.codeExamSolved.push(examResult)
        await user.save()

        return res.json({
            success: true,
            status: examResult.status,
            testResults,
            examResult
        })

    } catch (error) {
        console.error("Error saving exam result:", error);
        return res.status(500).json({ error: "Failed to save exam result" });
    }

})

// Endpoint to get answers for a specific exam by ID
// Взимаме резултатите по solvedExamId (а не examId)
app.get("/exam/answers/:examId", withAuth, async (req, res) => {
    const examId = req.params.examId;
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail }).populate({
            path: "solvedExams",
            populate: { path: "examId", model: "Exam" }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Намираме solvedExam за дадения examId
        const solvedExam = user.solvedExams.find(
            se => se.examId && se.examId._id.toString() === examId
        );

        if (!solvedExam) {
            return res.status(404).json({ error: "No solved exam found for this examId" });
        }

        const exam = solvedExam.examId;
        if (!exam || !Array.isArray(exam.questions)) {
            return res.status(500).json({ error: "Exam data is incomplete" });
        }

        // Създаваме map на отговорите на потребителя
        const userAnswersMap = {};
        solvedExam.allAnswers.forEach(({ questionId, answer }) => {
            userAnswersMap[questionId] = answer;
        });

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

        res.json({
            examId: exam._id,
            solvedExamId: solvedExam._id,
            title: exam.title,
            description: exam.description,
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

    } catch (err) {
        console.error("Error fetching exam answers:", err);
        res.status(500).json({ error: "Failed to fetch exam answers" });
    }
});

app.get("/exam/code/answers/:id", withAuth, async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Filter all submissions for the specific code exam
        const submissions = user.codeExamSolved
            .filter(se => se.codeExamId.toString() === id)
            .map(se => ({
                codeExamId: se.codeExamId,
                code: se.code,
                title: se.title,
                submittedAt: se.submittedAt,
                status: se.status,
                testCasesPassed: se.testCasesPassed,
                totalTestCases: se.totalTestCases,
                output: se.output
            }));

        if (submissions.length === 0) {
            return res.status(404).json({ error: "No submissions found for this exam" });
        }

        return res.json({ submissions });

    } catch (error) {
        console.error("Error fetching exam submissions:", error);
        return res.status(500).json({ error: "Failed to fetch exam submissions" });
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

// Endpoint to get user info, challenges, exams and tutorials
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

        // Use $elemMatch to ensure all conditions apply to the same array elements
        const result = await User.findOneAndUpdate(
            {
                email: userEmail,
                // Find a document that has an element in 'progressTutorial' that matches...
                progressTutorial: {
                    $elemMatch: {
                        language: tutorialLanguage,
                        // ...and within that element, a tutorial that matches these conditions
                        tutorials: {
                            $elemMatch: {
                                tutorialName: tutorialName,
                                endedAt: null // Crucially, check this on the specific tutorial
                            }
                        }
                    }
                }
            },
            {
                // The update operation remains the same
                $set: {
                    "progressTutorial.$[lang].tutorials.$[tut].endedAt": new Date()
                }
            },
            {
                // Your arrayFilters are mostly correct, but we can make them safer
                arrayFilters: [
                    { "lang.language": tutorialLanguage },
                    // Ensure the tutorial we update also matches the endedAt: null condition
                    { "tut.tutorialName": tutorialName, "tut.endedAt": null }
                ],
                new: true // This returns the updated document
            }
        );

        if (!result) {
            return res.status(404).json({ error: "Tutorial not found, has not been started, or has already ended." });
        }

        return res.status(200).json({ message: "Tutorial ended successfully." });

    } catch (error) {
        console.error("Error in end-tutorial:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint to execute user's code from coding challenges
app.post("/execute-code", withAuth, async (req, res) => {
    const { clientId, clientSecret, challengeId, code, language, versionIndex } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });
    const challenge = await Challenge.findById(challengeId);

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    if (!challenge) {
        return res.status(404).json({ error: "Challenge not found!" });
    }

    const testResults = await runAllTestCases(clientId, clientSecret, challenge.testCases, code, language, versionIndex);
    //console.log("test Results: ", testResults)

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

    //console.log(testResults)

    return res.status(200).json({
        success: allPassed,
        testResults,
        message: allPassed ? "All tests passed!" : "Some tests failed."
    });
});

// Endpoint to track when the user started the challenge
app.post("/start-challenge", withAuth, async (req, res) => {
    const { challengeId } = req.body;
    const email = req.user.email;

    try {
        // Add "started" challenge only if it doesn't already exist
        await User.updateOne(
            { email, "solvedChallenges.challengeId": { $ne: challengeId } },
            {
                $push: {
                    solvedChallenges: {
                        challengeId,
                        status: "started",
                        startedAt: new Date()
                    }
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Error starting challenge:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// Endpoint to save user's progress after leaving the web page
app.post("/save/challenge-progress", withAuth, async (req, res) => {
    const { challengeId, code } = req.body;
    const email = req.user.email;
    try {
        // Add "started" challenge only if it doesn't already exist
        const updateResult = await User.updateOne(
            { email, "solvedChallenges.challengeId": challengeId },
            {
                $set: {
                    "solvedChallenges.$.userCode": code,
                    "solvedChallenges.$.status": "started",
                    "solvedChallenges.$.updatedAt": new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            // If not found, insert new
            await User.updateOne(
                { email },
                {
                    $push: {
                        solvedChallenges: {
                            challengeId,
                            userCode: code,
                            status: "started",
                            startedAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error starting challenge:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// Endpoint send to front-end user's saved progress
app.post("/get/challenge-progress", withAuth, async (req, res) => {
    const { id } = req.body
    try {
        const userEmail = req.user.email

        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        const started = user.solvedChallenges.filter(c => c.challengeId.toString() === id)

        res.json({ challenges: started });

    } catch (error) {
        console.log(error)
    }
})

// Endpoint to track when the user finished the challenge and check user's progress
app.post("/end-challenge", withAuth, async (req, res) => {
    const { challengeId, code } = req.body;
    const email = req.user.email;

    try {
        const challenge = await Challenge.findById(challengeId).lean();

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Update if challenge already exists in solvedChallenges
        const updateResult = await User.updateOne(
            { email, "solvedChallenges.challengeId": challengeId },
            {
                $set: {
                    "solvedChallenges.$.status": "completed",
                    "solvedChallenges.$.completedAt": new Date(),
                    "solvedChallenges.$.code": code,
                    "solvedChallenges.$.difficulty": challenge.difficulty
                }
            }
        );

        // If it wasn't found, push it as completed
        if (updateResult.matchedCount === 0) {
            await User.updateOne(
                { email },
                {
                    $push: {
                        solvedChallenges: {
                            challengeId,
                            difficulty: challenge.difficulty,
                            status: "completed",
                            completedAt: new Date(),
                            code
                        }
                    }
                }
            );
        }

        // Recalculate progress level
        const user = await User.findOne({ email }, { solvedChallenges: 1 });
        const progressLevel = calculateUserProgressLevel(user.solvedChallenges);
        await User.updateOne({ email }, { $set: { progressLevel } });

        res.json({ success: true });
    } catch (error) {
        console.error("Error ending challenge:", error);
        res.status(500).json({ error: "Server error." });
    }
});
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
app.get('/get/exams', withAuth, async (req, res) => {
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

// Endpoint to get all code exam's based on user's language
app.get('/get/code-exams', withAuth, async (req, res) => {
    const userEmail = req.user.email
    if (!userEmail) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findOne({ email: userEmail })
        const codeExams = await CodeExam.find({ language: { $in: user.languages } })

        res.json(codeExams)
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }



})

// Endpoint to save created exam-questions to DB
app.post("/add/exam", withAuth, async (req, res) => {
    const { title, description, language, questions, difficulty, examTime } = req.body;
    const isAuthorized = req.user.role;

    //console.log(title, description)

    if (isAuthorized === "student") {
        return res.status(403).json({ message: "You are not authorized!" });
    }

    try {
        const newExam = new Exam({
            title,
            description,
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

// Endpoint to create a new coding exam
app.post("/add/code-exam", withAuth, async (req, res) => {
    const { title, description, language, code, starterCode, testCases, difficulty, time } = req.body;
    //console.log(req.body)
    const isAuthorized = req.user.role;

    if (isAuthorized === "student") {
        return res.status(403).json({ message: "You are not authorized!" });
    }

    try {
        const newExam = new CodeExam({
            title,
            description,
            language,
            difficulty,
            time: time,
            code,
            starterCode,
            testCases: testCases,
            createdAt: new Date(),

        });

        await newExam.save();

        res.status(200).json({ message: "Exam added successfully." });

    } catch (error) {
        console.error("Error adding exam questions:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/exam/start/:id", async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/get/code-exam/:id", async (req, res) => {
    try {
        //console.log(req.params.id)
        const exam = await CodeExam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" });
    }
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

// Endpoint to update exp date to JWT token 
app.post('/update-jwt', withAuth, async (req, res) => {
    const { examId } = req.body;
    const token = req.cookies.token;

    try {
        const exam = await Exam.findOne({ _id: examId }, { time: 1 });
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        const examTimeInSeconds = exam.time / 1000;
        const decoded = jwt.decode(token);
        const currentTimeInSec = Math.floor(Date.now() / 1000);

        // Calculate the new expiration TIMESTAMP
        // (Current Time + Remaining Time + Extra Exam Time)
        const newExpTimestamp = decoded.exp + examTimeInSeconds

        // A simpler way to think about it is just extending the original expiry time
        // const newExpTimestamp = decoded.exp + examTimeInSeconds;

        // Sign a new token with the UPDATED 'exp' field
        const newToken = jwt.sign({
            ...decoded,
            iat: currentTimeInSec, // It's good practice to update the 'issued at' time as well
            exp: newExpTimestamp   // Use the standard 'exp' field with the new timestamp
        }, jwtSecretKey);

        res.cookie('token', newToken, { httpOnly: true }).status(200).json({
            message: "Token updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while updating the token" });
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
    } else if (medium >= total * 0.4 || hard >= 2) {
        return 'intermediate';
    } else if (hard >= total * 0.5 || total >= 15) {
        return 'advanced';
    }

    return 'beginner';
}

// Function to run all test cases for a given code snippet
const runAllTestCases = async (clientId, clientSecret, testCases, code, language, versionIndex) => {
    const results = [];

    for (const testCase of testCases) {
        try {
            const res = await fetch("https://api.jdoodle.com/v1/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: clientId,
                    clientSecret: clientSecret,
                    script: code,
                    language: language,
                    versionIndex: versionIndex,
                    stdin: testCase.input,
                }),
            });

            const data = await res.json();
            //console.log(data.output)

            results.push({
                input: testCase.input,
                expected: testCase.expectedOutput,
                output: data.output?.trim() || "No output",
                passed: data.output?.trim() === testCase.expectedOutput.trim(),
            });

        } catch (err) {
            //console.error(err)
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