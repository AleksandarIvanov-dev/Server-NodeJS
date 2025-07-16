const express = require('express')
const axios = require('axios')
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path');
const ejs = require('ejs'); // delete
const jwt = require('jsonwebtoken');
const cookie = require('cookie'); // delete
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

// Schemas
const UserExamResults = require('./Schemas/userExamResults');
const Tutorial = require('./Schemas/tutorialSchema')
const User = require('./Schemas/userSchema');
const Challenge = require('./Schemas/challengeSchema');


// Initialize the Express application
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// Set up EJS as the view engine
// This allows us to render EJS templates for HTML files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "HTML_Files"));

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

    // Validate the request body
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
    const { firstName, lastName, email, password } = req.body;
    // Validate the user data
    if (!firstName || !lastName || !email || password === undefined || password === null) {
        return res.status(400).json({ error: "Invalid user data" });
    }

    try {
        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ firstName, lastName, email, password: hash });
        await newUser.save();

        // Immediately log in the user after successful signup
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, jwtSecretKey, {
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

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const userData = await User.findOne({ email });

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
                    languages: userData.languages || [], // assuming you have `languages` in user schema
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

    if (!languages || !Array.isArray(languages)) {
        return res.status(400).json({ error: "Languages must be an array" });
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

// Endpoint to authenticate JWT Token
app.get("/auth/user", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        const foundUser = await User.findById(decoded.id);
        res.status(200).json({ foundUser });
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
});

// Endpoint to receive exam results and save them to the database
app.post("/exam/results", withAuth, async (req, res) => {

    const { language, answers, correctCount, totalQuestions } = req.body;
    const userID = req.user.id;

    if (!userID) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate the request body
    if (!language || !answers || correctCount === undefined || totalQuestions === undefined) {
        return res.status(400).json({ error: "Invalid request data. Please provide all required fields." });
    }

    const grade = Math.round((correctCount / totalQuestions) * 5) + 1;
    try {
        const result = new UserExamResults({
            userId: userID,
            language,
            answers,
            correctCount,
            totalQuestions,
            completedAt: new Date(),
            isCompleted: grade >= 3,
        });
        await result.save();

        return res.status(200).json({
            message: "Exam result saved successfully",
            grade: `${grade}`,
            correctCount,
            totalQuestions
        });
    } catch (error) {
        console.error("Error saving exam result:", error);
        return res.status(500).json({ error: "Failed to save exam result" });
    }
})

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

// Route to check if the router has a valid token
app.get("/checkToken", withAuth, (req, res) => {
    res.sendStatus(200);
})

// Route to logout the current user
app.post("/logout", (req, res) => {
    res.clearCookie("token")
    res.sendStatus(200);
})

// Route to load all tutorials from DB
app.get("/alltutorials", withAuth, async (req, res) => {
    const userId = req.user.id;
    const selectedLang = req.query.lang;

    try {
        const filter = selectedLang ? { language: selectedLang } : {};

        const tutorials = await Tutorial.find(filter);
        const progress = await UserExamResults.find({ userId });

        const completedTutorialIds = progress.map(p => p.tutorialId?.toString());

        const result = tutorials.map(tutorial => ({
            ...tutorial.toObject(),
            completed: completedTutorialIds.includes(tutorial._id.toString())
        }));

        res.json(result);
    } catch (err) {
        console.error("Error fetching tutorials:", err);
        res.status(500).json({ error: "Failed to fetch tutorials" });
    }
});

// Endpoint to save user's progress in a tutorial
app.post("/save-progress", withAuth, async (req, res) => {
    const { language, tutorialId } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Initialize language progress if not existing
    if (!user.progress.has(language)) {
        user.progress.set(language, []);
    }

    const lessons = user.progress.get(language);

    // Add only if tutorialId not already present
    if (!lessons.includes(tutorialId)) {
        lessons.push(tutorialId);
        user.progress.set(language, lessons);
    }

    await user.save();
    res.status(200).json({ message: "Progress saved" });
})

// Endpoint to execute user's code from coding challenges
app.post("/execute-code", withAuth, async (req, res) => {
    const { challengeId, code, language, versionIndex } = req.body;
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });
    const challenge = await Challenge.findById(challengeId);

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    const allPassed = await runAllTestCases(challenge.testCases, code, language, versionIndex);

    if (allPassed) {
        // If all test cases passed, save the challenge as solved
        const alreadySolved = user.solvedChallenges.some(
            (item) => item.challengeId.toString() === challengeId
        );

        if (!alreadySolved) {
            user.solvedChallenges.push({ challengeId, code });
            await user.save();
        }

        return res.status(200).json({ success: true, message: "All tests passed!" });
    } else {
        return res.status(200).json({ success: false, message: "Some tests failed." });
    }
})

// Endpoint to get all challenges based on user's preferred languages
app.get('/challenges', withAuth, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const user = await User.findOne({ email: userEmail });

        if (!user || !Array.isArray(user.languages)) {
            return res.status(400).json({ error: "User or preferred languages not found." });
        }

        const challenges = await Challenge.find({ languageForDisplay: { $in: user.languages } });

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

// Function to run all test cases for a given challenge
async function runAllTestCases(testCases, code, language, indexVersion) {
    const postURL = "https://api.jdoodle.com/v1/execute";
    const clientId = "740b7e52c332bbbce02cdf69cb87461d";
    const clientSecret = "3b2d3849be5207c8e9354bb38d51100b12867d1f9a94d3e5540b7b821cc91b43";

    for (const testCase of testCases) {
        const payload = {
            clientId,
            clientSecret,
            script: code,
            stdin: testCase.input,
            language,
            versionIndex: indexVersion,
            compileOnly: false
        }

        try {
            const response = await axios.post(postURL, payload, {
                method: 'POST',
                headers: {
                    "Content-Type": "application.json"
                },
                body: JSON.stringify(payload)
            })

            const output = response.data.output.trim();
            const expectedOutput = testCase.expectedOutput.trim();

            if (output !== expectedOutput) {
                return false; // if any of the test cases fail return false
            }
        } catch (error) {
            console.error("Execution error: ", error?.response?.data || error);
            return false; // if there's an error in execution
        }
    }
    return true; // if all test cases passed
}

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