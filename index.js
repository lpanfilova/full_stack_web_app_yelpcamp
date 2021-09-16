
//including node.js modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp_camp', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

//if opened successfully, print `Database connected`
db.once("open", () => {
    console.log("Database connected");
});

//response object
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//routing for home page, first arg is path
app.get('/', (req, res) => {
    res.render('home')
})

//routing for making a new camp ground, first arg is path
app.get('/makecampground', (req, res) => {
    const camp = new campground({
        title: 'My Backyard', 
        description: 'Nice place',
        price: 0
    });
    await camp.save();
    res.send(camp)
})

//start a server
app.listen(3000, ()=> {
    console.log('Listening on port 3000')
})