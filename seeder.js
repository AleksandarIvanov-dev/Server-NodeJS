const mongoose = require('mongoose');
const tutorialSchema = require('./Schemas/tutorialSchema')

//  This file is used to load tutorials into MongoDB -> collection Tutorials
//  To run this file use node seeder.js

const tutorials = [
    { title: "Programming VS Coding", image: "/placeholder.png", text: "Programming vs Coding. What is the difference? Why both are important for creating softwares!", link: "/tutorials/programming-vs-coding" },
    { title: "Intro to Python", image: "/placeholder.png", text: "First program", link: "/tutorials/python/intro" },
    { title: "Variables", image: "/placeholder.png", text: "Variables", link: "/tutorials/python/" },
    { title: "Operators", image: "/placeholder.png", text: "What are Operators?", link: "/tutorials/operators" },
    { title: "Integers", image: "/placeholder.png", text: "What is an Integer?", link: "/tutorials/integers", language: "python" },
    { title: "Float", image: "/placeholder.png", text: "What is a Float?", link: "/tutorials/float", language: "python" }
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