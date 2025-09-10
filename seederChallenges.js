const Challenge = require('./Schemas/challengeSchema');
const mongoose = require('mongoose');

const challenges = [
    // Python
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
    return

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
    return

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
    return

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
    return

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
    {
        title: "Обръщане на низ",
        description: "Напишете програма, която обръща реда на символите в даден низ.",
        starterCode: `def reverse_string(s):
    # Върнете низа в обратен ред
    return

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
    return

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
    return

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
    return

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
    {
        title: "Проверка за палиндром",
        description: "Напишете програма, която проверява дали даден низ е палиндром (чете се еднакво отляво надясно и отдясно наляво).",
        starterCode: `def is_palindrome(s):
    # Върнете True ако s е палиндром, иначе False
    return

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
    return

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
    return

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
    return

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
                input: "3",
                expectedOutput: "1\n12\n123"
            },
            {
                input: "5",
                expectedOutput: "1\n12\n123\n1234\n12345"
            }
        ]
    },
    // JavaScript challenges
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
        title: "Обърни низ",
        description: "Напишете функция, която приема низ и го връща обърнат.",
        starterCode: "function reverseString(str) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "\"hello\"", expectedOutput: "\"olleh\"" },
            { input: "\"abc\"", expectedOutput: "\"cba\"" },
            { input: "\"racecar\"", expectedOutput: "\"racecar\"" }
        ],

        difficulty: "easy",
        sampleInput: "\"hello\"",
        sampleOutput: "\"olleh\""
    },
    {
        title: "Сума на числата в масив",
        description: "Върнете сумата на всички числа в даден масив.",
        starterCode: "function sumArray(arr) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "[1, 2, 3]", expectedOutput: "6" },
            { input: "[5, 5, 5, 5]", expectedOutput: "20" },
            { input: "[]", expectedOutput: "0" }
        ],

        difficulty: "easy",
        sampleInput: "[1, 2, 3]",
        sampleOutput: "6"
    },
    {
        title: "Проверка за палиндром",
        description: "Определете дали низът е палиндром (чете се еднакво отпред и отзад).",
        starterCode: "function isPalindrome(str) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "\"racecar\"", expectedOutput: "true" },
            { input: "\"hello\"", expectedOutput: "false" },
            { input: "\"madam\"", expectedOutput: "true" }
        ],

        difficulty: "easy",
        sampleInput: "\"racecar\"",
        sampleOutput: "true"
    },
    {
        title: "Число на Фибоначи",
        description: "Върнете n-тото число от редицата на Фибоначи. Последователността започва с 0, 1, 1, 2, 3...",
        starterCode: "function fibonacci(n) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "5", expectedOutput: "5" },
            { input: "10", expectedOutput: "55" },
            { input: "0", expectedOutput: "0" }
        ],

        difficulty: "medium",
        sampleInput: "5",
        sampleOutput: "5"
    },
    {
        title: "Най-дълга дума в изречение",
        description: "Върните най-дългата дума в дадено изречение.",
        starterCode: "function longestWord(sentence) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "\"The quick brown fox jumps\"", expectedOutput: "\"jumps\"" },
            { input: "\"May the force be with you\"", expectedOutput: "\"force\"" },
            { input: "\"To be or not to be\"", expectedOutput: "\"not\"" }
        ],

        difficulty: "medium",
        sampleInput: "\"The quick brown fox jumps\"",
        sampleOutput: "\"jumps\""
    },
    {
        title: "Намиране на дубликати в масив",
        description: "Върнете масив с всички дублирани елементи от входния масив.",
        starterCode: "function findDuplicates(arr) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "[1, 2, 3, 2, 4, 1]", expectedOutput: "[1, 2]" },
            { input: "[5, 5, 5, 5]", expectedOutput: "[5]" },
            { input: "[1, 2, 3]", expectedOutput: "[]" }
        ],

        difficulty: "medium",
        sampleInput: "[1, 2, 3, 2, 4, 1]",
        sampleOutput: "[1, 2]"
    },
    {
        title: "Проверка за валидни скоби",
        description: "Проверете дали входният низ съдържа балансирани скоби: (), {}, [].",
        starterCode: "function isValidBrackets(str) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "\"([])\"", expectedOutput: "true" },
            { input: "\"([)]\"", expectedOutput: "false" },
            { input: "\"{[()]}\"", expectedOutput: "true" }
        ],

        difficulty: "hard",
        sampleInput: "\"([])\"",
        sampleOutput: "true"
    },
    {
        title: "Разгъване на вложен масив",
        description: "Даден е вложен масив, върни плосък масив, съдържащ всички елементи.",
        starterCode: "function flattenArray(arr) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "[1, [2, [3, 4], 5]]", expectedOutput: "[1, 2, 3, 4, 5]" },
            { input: "[[1], [2], [3]]", expectedOutput: "[1, 2, 3]" },
            { input: "[1, 2, 3]", expectedOutput: "[1, 2, 3]" }
        ],

        difficulty: "hard",
        sampleInput: "[1, [2, [3, 4], 5]]",
        sampleOutput: "[1, 2, 3, 4, 5]"
    },
    {
        title: "Проверка за дълбока равенство",
        description: "Имплементирайте функция за дълбока проверка на равенство между две стойности.",
        starterCode: "function deepEqual(a, b) {\n  // Your code here\n}",
        language: "nodejs",
        languageForDisplay: "JavaScript",
        testCases: [
            { input: "({a: 1}, {a: 1})", expectedOutput: "true" },
            { input: "({a: 1, b: 2}, {a: 1})", expectedOutput: "false" },
            { input: "([1, 2], [1, 2])", expectedOutput: "true" }
        ],

        difficulty: "hard",
        sampleInput: "({a: 1}, {a: 1})",
        sampleOutput: "true"
    },

    // C++ challenges
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
        title: "Обърнат низ",
        description: "Напишете функция с параметър string, която да връща полученият низ обърнат",
        starterCode: "std::string reverseString(std::string str) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "\"hello\"", expectedOutput: "\"olleh\"" },
            { input: "\"abc\"", expectedOutput: "\"cba\"" },
            { input: "\"racecar\"", expectedOutput: "\"racecar\"" }
        ],

        difficulty: "easy",
        sampleInput: "\"hello\"",
        sampleOutput: "\"olleh\""
    },
    {
        title: "Сборт na елементите от масив",
        description: "Напишете фунцкия, която да връща сумата на всички цели числа в даден вектор.",
        starterCode: "int sumArray(std::vector<int> arr) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "[1, 2, 3]", expectedOutput: "6" },
            { input: "[10, 20, 30]", expectedOutput: "60" },
            { input: "[]", expectedOutput: "0" }
        ],

        difficulty: "easy",
        sampleInput: "[1, 2, 3]",
        sampleOutput: "6"
    },
    {
        title: "Проверка за палиндром",
        description: "Определите дали даден низ е палиндром (чете се еднакво отпред и отзад).",
        starterCode: "bool isPalindrome(std::string str) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "\"level\"", expectedOutput: "true" },
            { input: "\"test\"", expectedOutput: "false" },
            { input: "\"madam\"", expectedOutput: "true" }
        ],

        difficulty: "easy",
        sampleInput: "\"level\"",
        sampleOutput: "true"
    },
    {
        title: "Число на Фибоначи",
        description: "Върнете n-тото число от редицата на Фибоначи (индексирано от 0).",
        starterCode: "int fibonacci(int n) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "5", expectedOutput: "5" },
            { input: "10", expectedOutput: "55" },
            { input: "0", expectedOutput: "0" }
        ],

        difficulty: "medium",
        sampleInput: "5",
        sampleOutput: "5"
    },
    {
        title: "Намиране на най-голям елемент",
        description: "Върнете най-големия елемент в даден масив.",
        starterCode: "int findMax(std::vector<int> arr) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "[1, 3, 2]", expectedOutput: "3" },
            { input: "[-5, -2, -9]", expectedOutput: "-2" },
            { input: "[10]", expectedOutput: "10" }
        ],

        difficulty: "medium",
        sampleInput: "[1, 3, 2]",
        sampleOutput: "3"
    },
    {
        title: "Валидни скоби",
        description: "Определете дали входният низ съдържа валидни и балансирани скоби.",
        starterCode: "int removeDuplicates(std::vector<int>& nums) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "[1,1,2]", expectedOutput: "2" },
            { input: "[0,0,1,1,1,2,2,3,3,4]", expectedOutput: "5" },
            { input: "[1,2,3]", expectedOutput: "3" }
        ],

        difficulty: "medium",
        sampleInput: "[1,1,2]",
        sampleOutput: "2"
    },
    {
        title: "Valid Parentheses",
        description: "Determine if the input string has valid and balanced parentheses.",
        starterCode: "bool isValid(std::string s) {\n    // Your code here\n}",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "\"()[]{}\"", expectedOutput: "true" },
            { input: "\"(]\"", expectedOutput: "false" },
            { input: "\"([{}])\"", expectedOutput: "true" }
        ],

        difficulty: "hard",
        sampleInput: "\"()[]{}\"",
        sampleOutput: "true"
    },
    {
        title: "Разгъване на двумерен вектор",
        description: "Имплементирайте клас, който разгъва двумерен вектор и поддържа функциите next() и hasNext().",
        starterCode: "class Vector2D {\npublic:\n    Vector2D(std::vector<std::vector<int>>& vec) {\n        // Your code here\n    }\n\n    int next() {\n        // Your code here\n    }\n\n    bool hasNext() {\n        // Your code here\n    }\n};",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "[[1,2],[3],[4]]", expectedOutput: "[1,2,3,4]" },
            { input: "[[],[1],[2,3]]", expectedOutput: "[1,2,3]" },
            { input: "[[]]", expectedOutput: "[]" }
        ],

        difficulty: "hard",
        sampleInput: "[[1,2],[3],[4]]",
        sampleOutput: "[1,2,3,4]"
    },
    {
        title: "LRU кеш",
        description: "Проектиране и имплементиране на структура от данни за Least Recently Used (LRU) кеш. Трябва да поддържа операциите get и put с времева сложност O(1).",
        starterCode: "class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        // Your code here\n    }\n\n    int get(int key) {\n        // Your code here\n    }\n\n    void put(int key, int value) {\n        // Your code here\n    }\n};",
        language: "cpp",
        languageForDisplay: "C++",
        testCases: [
            { input: "put(1,1); put(2,2); get(1); put(3,3); get(2);", expectedOutput: "1,-1" },
            { input: "put(2,1); put(2,2); get(2);", expectedOutput: "2" }
        ],

        difficulty: "hard",
        sampleInput: "put(1,1); put(2,2); get(1); put(3,3); get(2);",
        sampleOutput: "1,-1"
    },

    // C# challenges
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
    },
    {
        title: "Обърни низ",
        description: "Напиши функция, която приема низ и го връща обърнат.",
        starterCode: "public string ReverseString(string str)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "\"hello\"", expectedOutput: "\"olleh\"" },
            { input: "\"abc\"", expectedOutput: "\"cba\"" },
            { input: "\"racecar\"", expectedOutput: "\"racecar\"" }
        ],
        difficulty: "easy",
        sampleInput: "\"hello\"",
        sampleOutput: "\"olleh\""
    },
    {
        title: "Сума на елементи в масив",
        description: "Върни сумата на всички цели числа в масив.",
        starterCode: "public int SumArray(int[] arr)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "[1, 2, 3]", expectedOutput: "6" },
            { input: "[10, 20, 30]", expectedOutput: "60" },
            { input: "[]", expectedOutput: "0" }
        ],

        difficulty: "easy",
        sampleInput: "[1, 2, 3]",
        sampleOutput: "6"
    },
    {
        title: "Проверка за палиндром",
        description: "Провери дали даден низ е палиндром (чете се еднакво отляво и отдясно).",
        starterCode: "public bool IsPalindrome(string str)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "\"level\"", expectedOutput: "true" },
            { input: "\"test\"", expectedOutput: "false" },
            { input: "\"madam\"", expectedOutput: "true" }
        ],

        difficulty: "easy",
        sampleInput: "\"level\"",
        sampleOutput: "true"
    },
    {
        title: "Число на Фибоначи",
        description: "Върни n-тото число от редицата на Фибоначи (индексирано от 0).",
        starterCode: "public int Fibonacci(int n)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "5", expectedOutput: "5" },
            { input: "10", expectedOutput: "55" },
            { input: "0", expectedOutput: "0" }
        ],

        difficulty: "medium",
        sampleInput: "5",
        sampleOutput: "5"
    },
    {
        title: "Намиране на най-голям елемент",
        description: "Върни най-голямото число в даден масив от цели числа.",
        starterCode: "public int FindMax(int[] arr)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "[1, 3, 2]", expectedOutput: "3" },
            { input: "[-5, -2, -9]", expectedOutput: "-2" },
            { input: "[10]", expectedOutput: "10" }
        ],

        difficulty: "medium",
        sampleInput: "[1, 3, 2]",
        sampleOutput: "3"
    },
    {
        title: "Премахване на повтарящи се елементи от сортиран масив",
        description: "Даден е сортиран масив. Премахни повтарящите се елементи на място и върни новата дължина.",
        starterCode: "public int RemoveDuplicates(int[] nums)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "[1,1,2]", expectedOutput: "2" },
            { input: "[0,0,1,1,1,2,2,3,3,4]", expectedOutput: "5" },
            { input: "[1,2,3]", expectedOutput: "3" }
        ],

        difficulty: "medium",
        sampleInput: "[1,1,2]",
        sampleOutput: "2"
    },
    {
        title: "Валидни скоби",
        description: "Провери дали даден низ съдържа валидни и балансирани скоби.",
        starterCode: "public bool IsValid(string s)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "\"()[]{}\"", expectedOutput: "true" },
            { input: "\"(]\"", expectedOutput: "false" },
            { input: "\"([{}])\"", expectedOutput: "true" }
        ],

        difficulty: "hard",
        sampleInput: "\"()[]{}\"",
        sampleOutput: "true"
    },
    {
        title: "Разгъване на вложен списък",
        description: "Разгъни вложен списък от цели числа. Всеки елемент може да бъде число или списък.",
        starterCode: "public IList<int> Flatten(IList<object> nestedList)\n{\n    // Your code here\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "[1, [2, [3]]]", expectedOutput: "[1, 2, 3]" },
            { input: "[[1], [2], [3]]", expectedOutput: "[1, 2, 3]" },
            { input: "[1, 2, 3]", expectedOutput: "[1, 2, 3]" }
        ],

        difficulty: "hard",
        sampleInput: "[1, [2, [3]]]",
        sampleOutput: "[1, 2, 3]"
    },
    {
        title: "LRU кеш",
        description: "Създай структура от данни за Least Recently Used (LRU) кеш. Тя трябва да поддържа операциите get и put с времева сложност O(1).",
        starterCode: "public class LRUCache {\n    public LRUCache(int capacity) {\n        // Your code here\n    }\n\n    public int Get(int key) {\n        // Your code тук\n    }\n\n    public void Put(int key, int value) {\n        // Your code тук\n    }\n}",
        language: "csharp",
        languageForDisplay: "C#",
        testCases: [
            { input: "Put(1,1); Put(2,2); Get(1); Put(3,3); Get(2);", expectedOutput: "1,-1" },
            { input: "Put(2,1); Put(2,2); Get(2);", expectedOutput: "2" }
        ],

        difficulty: "hard",
        sampleInput: "Put(1,1); Put(2,2); Get(1); Put(3,3); Get(2);",
        sampleOutput: "1,-1"
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