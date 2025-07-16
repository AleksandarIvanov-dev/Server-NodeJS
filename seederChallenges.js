const Challenge = require('./Schemas/challengeSchema');
const mongoose = require('mongoose');

const challenges = [
    {
        title: "Сумирай две числа",
        description: "Напишете програма, която въвежда две цели числа и извежда тяхната сума.",
        starterCode: `# Вашият код тук`,
        language: "python",
        languageForDisplay: "Python",
        sampleInput: "2\n3",
        sampleOutput: "5",
        testCases: [
            { input: "2\n3", expectedOutput: "5" },
            { input: "10\n-4", expectedOutput: "6" }
        ],
    },
    {
        title: "Проверка за четно число",
        description: "Напишете програма, която проверява дали дадено цяло число е четно.",
        starterCode: `# Вашият код тук`,
        language: "python",
        languageForDisplay: "Python",
        sampleInput: "10",
        sampleOutput: "true",
        testCases: [
            { input: "2", expectedOutput: "true" },
            { inputL: "3", expectedOutput: "false" }
        ]
    },
    {
        title: "Обърни низ",
        description: "Въведете низ и го обърнете обратно. Изведете получения низ.",
        starterCode: `import java.util.*;\npublic class Main {\n    // Вашият код тук\n    }\n}`,
        language: "java",
        languageForDisplay: "Java",
        sampleInput: "hello",
        sampleOutput: "olleh",
        testCases: [
            { input: "hello", expectedOutput: "olleh" },
            { input: "Java", expectedOutput: "avaJ" }
        ]
    },
    {
        title: "Намиране на най-голямо число",
        description: "Въведете три числа и намерете най-голямото от тях.",
        starterCode: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n  // Вашият код тук\n    }\n}`,
        language: "java",
        languageForDisplay: "Java",
        sampleInput: "1\n2\n3",
        sampleOutput: "3",
        testCases: [
            { input: "1\n2\n3", expectedOutput: "3" },
            { input: "5\n5\n4", expectedOutput: "5" }
        ]
    },
    {
        title: "Провери дали числото е четно",
        description: "Въведете цяло число и отпечатайте 'Even', ако е четно, или 'Odd', ако е нечетно.",
        starterCode: `// Вашият код тук\n});`,
        language: "",
        languageForDisplay: "JavaScript",
        sampleInput: "4",
        sampleOutput: "Even",
        testCases: [
            { input: "4", expectedOutput: "Even" },
            { input: "7", expectedOutput: "Odd" }
        ]
    },
    {
        title: "Събиране на две числа",
        description: "Въведете две цели числа и отпечатайте тяхната сума.",
        starterCode: `// Вашият код тук\n});`,
        language: "",
        languageForDisplay: "JavaScript",
        sampleInput: "4\n2",
        sampleOutput: "6",
        testCases: [
            { input: "4\n2", expectedOutput: "6" },
            { input: "10\n-5", expectedOutput: "5" }
        ]
    },
    {
        title: "Най-голямото от две числа",
        description: "Въведете две цели числа и изведете по-голямото от тях.",
        starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n   // Вашият код тук\n    return 0;\n}`,
        language: "cpp",
        languageForDisplay: "C++",
        sampleInput: "4 7",
        sampleOutput: "7",
        testCases: [
            { input: "4 7", expectedOutput: "7" },
            { input: "9 2", expectedOutput: "9" }
        ]
    },
    {
        title: "Брой на цифрите",
        description: "Въведете цяло положително число и изведете колко цифри съдържа то.",
        starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n   // Вашият код тук\n    return 0;\n}`,
        language: "cpp",
        languageForDisplay: "C++",
        sampleInput: "123",
        sampleOutput: "3",
        testCases: [
            { input: "123", expectedOutput: "3" },
            { input: "5", expectedOutput: "1" },
            { input: "10000", expectedOutput: "5" }
        ]
    },
    {
        title: "Брой на цифрите",
        description: "Въведете цяло положително число и изведете колко цифри съдържа то.",
        starterCode: `using System;\n\nclass Program {\n    static void Main() {\n  // Вашият код тук\n    }\n}`,
        language: "csharp",
        languageForDisplay: "C#",
        sampleInput: "123",
        sampleOutput: "3",
        testCases: [
            { input: "123", expectedOutput: "3" },
            { input: "5", expectedOutput: "1" },
            { input: "10000", expectedOutput: "5" }
        ]
    },
    {
        title: "Най-голямото от две числа",
        description: "Въведете две цели числа и изведете по-голямото от тях.",
        starterCode: `using System;\n\nclass Program {\n    static void Main() {\n  // Вашият код тук\n    }\n}`,
        language: "csharp",
        languageForDisplay: "C#",
        sampleInput: "4 7",
        sampleOutput: "7",
        testCases: [
            { input: "4 7", expectedOutput: "7" },
            { input: "9 2", expectedOutput: "9" }
        ]
    }
]

async function connectToDB() {
    const dbURI = "mongodb+srv://Aleksandar:zxcvbnmsahko01@educational.t8exfzw.mongodb.net/Users?retryWrites=true&w=majority&appName=Educational";

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB!");

        await Challenge.deleteMany({});
        await Challenge.insertMany(challenges)
        console.log('Challenges inserted successfully');
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

connectToDB();