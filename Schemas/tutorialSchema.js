const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    link: String,
    language: String,
});

const tutorials = mongoose.model("tutorials", tutorialSchema);

module.exports = tutorials;