const Challenge = require('./Schemas/challengeSchema');
const mongoose = require('mongoose');

const challenges = [
    {
        title: "Пирамида от звезди",
        description: "Напишете програма, която принтира пирамида от звездички с дадена височина.",
        starterCode: "# Вашият код тук",
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "4",
        sampleOutput: "   *\n  ***\n *****\n*******",
        difficulty: "easy",
        testCases: [
            {
                input: "3",
                expectedOutput: "  *\n ***\n*****"
            },
            {
                input: "5",
                expectedOutput: "    *\n   ***\n  *****\n *******\n*********"
            }
        ]
    },
    {
        title: "Проверка за четно число",
        description: "Напишете програма, която проверява дали дадено цяло число е четно.",
        starterCode: `def is_even(num):
    # Върнете True ако num е четно, иначе False
    pass

num = int(input())
print(str(is_even(num)).lower())`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "10",
        sampleOutput: "true",
        difficulty: "easy",
        testCases: [
            { input: "2", expectedOutput: "true" },
            { input: "3", expectedOutput: "false" }
        ]
    },
    {
        title: "Сумиране на две числа",
        description: "Напишете програма, която чете две цели числа и извежда тяхната сума.",
        starterCode: `def sum_two_numbers(a, b):
    # Върнете сумата на a и b
    pass

a, b = map(int, input().split())
print(sum_two_numbers(a, b))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "4 7",
        sampleOutput: "11",
        difficulty: "easy",
        testCases: [
            { input: "1 2", expectedOutput: "3" },
            { input: "10 15", expectedOutput: "25" }
        ]
    },
    {
        title: "Пресмятане на лице на правоъгълник",
        description: "Напишете програма, която намира лицето на правоъгълник по зададени дължина и ширина.",
        starterCode: `def rectangle_area(length, width):
    # Върнете лицето на правоъгълника
    pass

l, w = map(int, input().split())
print(rectangle_area(l, w))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "5 3",
        sampleOutput: "15",
        difficulty: "easy",
        testCases: [
            { input: "2 4", expectedOutput: "8" },
            { input: "6 7", expectedOutput: "42" }
        ]
    },
    {
        title: "Превръщане на температура",
        description: "Напишете програма, която превръща температура от Целзий във Фаренхайт.",
        starterCode: `def celsius_to_fahrenheit(c):
    # Формула: F = C * 9/5 + 32
    pass

c = float(input())
print(celsius_to_fahrenheit(c))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "0",
        sampleOutput: "32.0",
        difficulty: "easy",
        testCases: [
            { input: "100", expectedOutput: "212.0" },
            { input: "20", expectedOutput: "68.0" }
        ]
    },

    // Medium challenges
    {
        title: "Обръщане на низ",
        description: "Напишете програма, която обръща реда на символите в даден низ.",
        starterCode: `def reverse_string(s):
    # Върнете низа в обратен ред
    pass

s = input()
print(reverse_string(s))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "hello",
        sampleOutput: "olleh",
        difficulty: "medium",
        testCases: [
            { input: "python", expectedOutput: "nohtyp" },
            { input: "abc", expectedOutput: "cba" }
        ]
    },
    {
        title: "Намиране на факториел",
        description: "Напишете програма, която намира факториела на дадено цяло число n.",
        starterCode: `def factorial(n):
    # Върнете факториела на n (n!)
    pass

n = int(input())
print(factorial(n))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "5",
        sampleOutput: "120",
        difficulty: "medium",
        testCases: [
            { input: "3", expectedOutput: "6" },
            { input: "6", expectedOutput: "720" }
        ]
    },
    {
        title: "Сумиране на цифрите на число",
        description: "Напишете програма, която намира сумата на всички цифри на дадено цяло число.",
        starterCode: `def sum_of_digits(num):
    # Върнете сумата на цифрите на num
    pass

n = int(input())
print(sum_of_digits(n))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "1234",
        sampleOutput: "10",
        difficulty: "medium",
        testCases: [
            { input: "987", expectedOutput: "24" },
            { input: "555", expectedOutput: "15" }
        ]
    },
    {
        title: "Броене на гласните в низ",
        description: "Напишете програма, която брои колко гласни има в даден низ.",
        starterCode: `def count_vowels(s):
    # Бройте колко гласни (a, e, i, o, u) има в низа
    pass

s = input()
print(count_vowels(s))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "hello world",
        sampleOutput: "3",
        difficulty: "medium",
        testCases: [
            { input: "programming", expectedOutput: "3" },
            { input: "aeiou", expectedOutput: "5" }
        ]
    },

    // Hard challenges
    {
        title: "Проверка за палиндром",
        description: "Напишете програма, която проверява дали даден низ е палиндром (чете се еднакво отляво надясно и отдясно наляво).",
        starterCode: `def is_palindrome(s):
    # Върнете True ако s е палиндром, иначе False
    pass

s = input()
print(str(is_palindrome(s)).lower())`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "madam",
        sampleOutput: "true",
        difficulty: "hard",
        testCases: [
            { input: "racecar", expectedOutput: "true" },
            { input: "python", expectedOutput: "false" }
        ]
    },
    {
        title: "Намиране на най-дългата дума в изречение",
        description: "Напишете програма, която намира най-дългата дума в дадено изречение.",
        starterCode: `def longest_word(sentence):
    # Върнете най-дългата дума в изречението
    pass

sentence = input()
print(longest_word(sentence))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "I love programming in Python",
        sampleOutput: "programming",
        difficulty: "hard",
        testCases: [
            { input: "Java is cool", expectedOutput: "Java" },
            { input: "Python is awesome language", expectedOutput: "awesome" }
        ]
    },
    {
        title: "Сортиране на списък от числа",
        description: "Напишете програма, която сортира списък от числа във възходящ ред.",
        starterCode: `def sort_numbers(numbers):
    # Върнете списъка подреден във възходящ ред
    pass

nums = list(map(int, input().split()))
print(' '.join(map(str, sort_numbers(nums))))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "4 1 3 2",
        sampleOutput: "1 2 3 4",
        difficulty: "hard",
        testCases: [
            { input: "10 5 8 1", expectedOutput: "1 5 8 10" },
            { input: "7 7 7", expectedOutput: "7 7 7" }
        ]
    },
    {
        title: "Генериране на всички пермутации",
        description: "Напишете програма, която генерира всички възможни пермутации на символите в даден низ.",
        starterCode: `import itertools

def all_permutations(s):
    # Върнете списък с всички пермутации на символите в низа
    pass

s = input()
print(' '.join(all_permutations(s)))`,
        language: "python3",
        languageForDisplay: "Python",
        sampleInput: "abc",
        sampleOutput: "abc acb bac bca cab cba",
        difficulty: "hard",
        testCases: [
            { input: "ab", expectedOutput: "ab ba" },
            { input: "xy", expectedOutput: "xy yx" }
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
        difficulty: "easy",
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
        difficulty: "medium",
        testCases: [
            { input: "1\n2\n3", expectedOutput: "3" },
            { input: "5\n5\n4", expectedOutput: "5" }
        ]
    },
    {
        title: "Числов триъгълник",
        description: "Напишете програма, която принтира триъгълник от числа, започвайки от 1.",
        starterCode: "# Вашият код тук",
        language: "java",
        languageForDisplay: "Java",
        sampleInput: "4",
        sampleOutput: "1\n12\n123\n1234",
        difficulty: "easy",
        testCases: [
            {
                "input": "3",
                "expectedOutput": "1\n12\n123"
            },
            {
                "input": "5",
                "expectedOutput": "1\n12\n123\n1234\n12345"
            }
        ]
    },
    {
        title: "Провери дали числото е четно",
        description: "Въведете цяло число и отпечатайте 'Even', ако е четно, или 'Odd', ако е нечетно.",
        starterCode: `// Вашият код тук\n`,
        language: "nodejs",
        languageForDisplay: "JavaScript",
        sampleInput: "4",
        sampleOutput: "Even",
        difficulty: "easy",
        testCases: [
            { input: "4", expectedOutput: "Even" },
            { input: "7", expectedOutput: "Odd" }
        ]
    },
    {
        title: "Събиране на две числа",
        description: "Въведете две цели числа и отпечатайте тяхната сума.",
        starterCode: `// Вашият код тук\n`,
        language: "nodejs",
        languageForDisplay: "JavaScript",
        sampleInput: "4\n2",
        sampleOutput: "6",
        difficulty: "easy",
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
        difficulty: "easy",
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
        difficulty: "easy",
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
        difficulty: "easy",
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
        difficulty: "easy",
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