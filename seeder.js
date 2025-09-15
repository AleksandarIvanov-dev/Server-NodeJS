const mongoose = require('mongoose');
const tutorialSchema = require('./Schemas/tutorialSchema')

//  This file is used to load tutorials into MongoDB -> collection Tutorials
//  To run this file use node seeder.js

const tutorials = [
    // Python Tutorials
    {
        title: "Programming VS Coding",
        image: "http://localhost:5000/Images/Python/maxresdefault.jpg",
        text: "Programming vs Coding – каква е разликата между програмиране и писане на код? Ще разберете защо и двата термина са важни за създаването на софтуер и как се допълват един друг.",
        link: "/tutorials/programming-vs-coding",
        language: "Python"
    },
    {
        title: "Въведение в Python",
        image: "http://localhost:5000/Images/Python/py.png",
        text: "Въведение в Python – първи стъпки с един от най-популярните езици за програмиране. Ще научите как да създадете първия си Python скрипт и как работи езикът.",
        link: "/tutorials/python/intro",
        language: "Python"
    },
    {
        title: "Вход и изход",
        image: "http://localhost:5000/Images/Python/python-io.webp",
        text: "Ще научите как да въвеждате данни от потребителя и как да извеждате резултати на екрана в Python – основа за всяка интерактивна програма.",
        link: "/tutorials/python/io",
        language: "Python"
    },
    {
        title: "Конвенции в Python",
        image: "http://localhost:5000/Images/Python/python-conventions.webp",
        text: "Ще се запознаете с основните конвенции за писане на чист и четим Python код, които ще ви помогнат да бъдете по-добър програмист и да работите ефективно в екип.",
        link: "/tutorials/python/conventions",
        language: "Python"
    },
    {
        title: "Променливи в Python",
        image: "http://localhost:5000/Images/Python/python-variable.webp",
        text: "Ще научите какво представляват променливите, как се създават и каква информация могат да съхраняват в Python програмите ви.",
        link: "/tutorials/python/variables",
        language: "Python"
    },
    {
        title: "Числа в Python",
        image: "http://localhost:5000/Images/Python/python-numbers.webp",
        text: "Ще откриете какви видове числа поддържа Python – цели, дробни, комплексни – и как да работите с тях в изчисления и формули.",
        link: "/tutorials/python/numbers",
        language: "Python"
    },
    {
        title: "Низове в Python",
        image: "http://localhost:5000/Images/Python/python-strings.jpg",
        text: "Ще научите какво е символен низ, как се създава, променя и форматира, и как се използва в реални програми.",
        link: "/tutorials/python/string",
        language: "Python"
    },
    {
        title: "Оператори в Python",
        image: "http://localhost:5000/Images/Python/python-operators.png",
        text: "Ще се запознаете с различните видове оператори – аритметични, логически, сравнителни – и как те могат да направят кода ви по-ефективен.",
        link: "/tutorials/python/operators",
        language: "Python"
    },
    {
        title: "Условни оператори в Python",
        image: "http://localhost:5000/Images/Python/python-if.webp",
        text: "Ще научите как да управлявате потока на програмата чрез условни оператори – if, elif, else – и кога е подходящо да ги използвате.",
        link: "/tutorials/python/conditions",
        language: "Python"
    },
    {
        title: "Цикли в Python",
        image: "http://localhost:5000/Images/Python/python-loops.jpg",
        text: "Ще разберете как да повтаряте операции с помощта на цикли – for и while – и как да ги използвате за автоматизиране на задачи.",
        link: "/tutorials/python/cycles",
        language: "Python"
    },
    {
        title: "Списъци в Python",
        image: "http://localhost:5000/Images/Python/python-lists.webp",
        text: "Ще научите какво е списък (list) в Python, как да го създавате, променяте и обхождате, и защо е толкова полезен в програмирането.",
        link: "/tutorials/python/lists",
        language: "Python"
    },
    {
        title: "Речници в Python",
        image: "http://localhost:5000/Images/Python/python-dict.jpg",
        text: "Ще откриете какво е речник (dictionary) в Python и как може да съхранявате и извличате данни по ключове.",
        link: "/tutorials/python/dict",
        language: "Python"
    },
    {
        title: "Създаване на функции в Python",
        image: "http://localhost:5000/Images/Python/python-functions.jpg",
        text: "Ще научите как да създавате собствени функции, как да им подавате параметри и как да връщате резултати – ключово умение за по-структуриран код.",
        link: "/tutorials/python/functions",
        language: "Python"
    },

    // Java Tutorials
    {
        title: "Въведение в Java",
        image: "http://localhost:5000/Images/Java/Java_Intro.jpg",
        text: "Ще се запознаете с езика Java – неговите основи, синтаксис и защо е толкова популярен за разработка на приложения и игри.",
        link: "/tutorials/java/intro",
        language: "Java"
    },
    {
        title: "Вход Изход",
        image: "http://localhost:5000/Images/Java/Java-IO.jpg",
        text: "Ще научите как да четете вход от потребителя и как да извеждате данни в Java – ключово умение за създаване на интерактивни програми.",
        link: "/tutorials/java/io",
        language: "Java"
    },
    {
        title: "Конвенции в Java",
        image: "http://localhost:5000/Images/Java/Java-Conventions.jpg",
        text: "Ще разберете кои са основните правила и конвенции за писане на Java код, които правят програмите по-лесни за четене и поддръжка.",
        link: "/tutorials/java/conventions",
        language: "Java"
    },
    {
        title: "Типове данни в Java",
        image: "http://localhost:5000/Images/Java/Java-Data-Types.png",
        text: "Ще се запознаете с основните типове данни в Java – цели числа, дробни числа, символи, булеви стойности – и как се използват.",
        link: "/tutorials/java/data-types",
        language: "Java"
    },
    {
        title: "Променливи в Java",
        image: "http://localhost:5000/Images/Java/Java-Variables.jpg",
        text: "Ще научите какво са променливите в Java, как се декларират и инициализират, и как се използват в програмите.",
        link: "/tutorials/java/variables",
        language: "Java"
    },
    {
        title: "Символни низове в Java",
        image: "http://localhost:5000/Images/Java/Java-Strings.png",
        text: "Ще откриете как да работите със символни низове (Strings) в Java – създаване, модифициране и сравняване на текст.",
        link: "/tutorials/java/strings",
        language: "Java"
    },
    {
        title: "Оператори в Java",
        image: "http://localhost:5000/Images/Java/Java-Operators.jpg",
        text: "Ще се запознаете с операторите в Java – математически, логически и сравнителни – и как да ги прилагате в кода си.",
        link: "/tutorials/java/operators",
        language: "Java"
    },
    {
        title: "Условни оператори в Java",
        image: "http://localhost:5000/Images/Java/Java-Con-Statements.webp",
        text: "Ще научите как да управлявате изпълнението на програмата с помощта на if, else и switch операторите в Java.",
        link: "/tutorials/java/conditions",
        language: "Java"
    },
    {
        title: "Цикли в Java",
        image: "http://localhost:5000/Images/Java/Java-Loops.jpg",
        text: "Ще разберете как да повтаряте операции с помощта на цикли – for, while, do-while – и кога да използвате всеки вид.",
        link: "/tutorials/java/cycles",
        language: "Java"
    }, {
        title: "Масиви в Java",
        image: "http://localhost:5000/Images/Java/Java-Arrays.jpg",
        text: "Ще се запознаете с масивите в Java – как да ги създавате, обхождате и използвате за съхранение на множество стойности.",
        link: "/tutorials/java/arrays",
        language: "Java"
    }, {
        title: "Java Maps",
        image: "http://localhost:5000/Images/Java/Java-Maps.jpeg",
        text: "Ще се запознаете с Maps и видовете Maps в Java – как да ги създавате, обхождате и използвате за съхранение на множество стойности.",
        link: "/tutorials/java/maps",
        language: "Java"
    },
    {
        title: "Методи в Java",
        image: "http://localhost:5000/Images/Java/Java-Methods.jpg",
        text: "Ще научите какво представляват методите в Java, как се дефинират и извикват, и защо са важни за модулното програмиране.",
        link: "/tutorials/java/func",
        language: "Java"
    },


    // JavaScript Tutorials
];

async function connectToDB() {
    const dbURI = "mongodb+srv://Aleksandar:zxcvbnmsahko01@educational.t8exfzw.mongodb.net/Users?retryWrites=true&w=majority&appName=Educational";

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB!");

        await tutorialSchema.deleteMany({});
        await tutorialSchema.insertMany(tutorials);
        console.log('Tutorials inserted successfully');
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

connectToDB();