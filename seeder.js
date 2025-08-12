const mongoose = require('mongoose');
const tutorialSchema = require('./Schemas/tutorialSchema')

//  This file is used to load tutorials into MongoDB -> collection Tutorials
//  To run this file use node seeder.js

const tutorials = [
    { title: "Programming VS Coding", image: "http://localhost:5000/Images/maxresdefault.jpg", text: "Programming vs Coding. Каква е разликата? Защо и двата термина за важни за създаването на софтуер!", link: "/tutorials/programming-vs-coding", language: "Python" },
    { title: "Въведение в Python", image: "http://localhost:5000/Images/py.png", text: "First program", link: "/tutorials/python/intro", language: "Python" },
    { title: "Вход и изход", image: "http://localhost:5000/Images/python-io.webp", text: "Вход и изход в Python и защо те са едни от най използваните фунцкии в Python.", link: "/tutorials/python/io", language: "Python" },
    { title: "Конвенции в Python", image: "http://localhost:5000/Images/python-conventions.webp", text: "Конвенции в Python. Как те могат да направят нашият код по чист и четим", link: "/tutorials/python/conventions", language: "Python" },
    { title: "Променливи в Python", image: "http://localhost:5000/Images/python-variable.webp", text: "Какво са променливи? Каква информация съдъжат те?", link: "/tutorials/python/variables", language: "Python" },
    { title: "Числа в Python", image: "http://localhost:5000/Images/python-numbers.webp", text: "Какви видове числа има в Python? Колко вида чила поддържа Python?", link: "/tutorials/python/numbers", language: "Python" },
    { title: "Низове в Python", image: "http://localhost:5000/Images/python-strings.jpg", text: "Какво е символен низ? За какво се използва?", link: "/tutorials/python/string", language: "Python" },
    { title: "Оператори в Python", image: "http://localhost:5000/Images/python-operators.png", text: "Видове оператор и с какво могат да са ни полезни.", link: "/tutorials/python/operators", language: "Python" },
    { title: "Условни оператори в Python", image: "http://localhost:5000/Images/python-if.webp", text: "Условни оператори в Python и защо са полезни в програмирането", link: "/tutorials/python/conditions", language: "Python" },
    { title: "Цикли в Python", image: "http://localhost:5000/Images/python-loops.jpg", text: "Видове цикли в Python", link: "/tutorials/python/cycles", language: "Python" },
    { title: "Списъци в Python", image: "http://localhost:5000/Images/python-lists.webp", text: "Какво е list? Защо е въведен в Python?", link: "/tutorials/python/lists", language: "Python" },
    { title: "Речници в Python", image: "http://localhost:5000/Images/python-dict.jpg", text: "Какво е речник в Python?", link: "/tutorials/python/dict", language: "Python" },
    { title: "Създаване на фунцкии в Python", image: "http://localhost:5000/Images/python-functions.jpg", text: "Какво е функция? Как се създават функции? Защо са полезни?", link: "/tutorials/python/functions", language: "Python" },
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