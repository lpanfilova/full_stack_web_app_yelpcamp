
//including node.js modules
const express = require('express');
//path module joins multiple paths together
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

//using ejs
app.set('view engine', 'ejs');
//joining current directory with /views
app.set('views', path.join(__dirname, '/views'));

//routes are matched in order
//routing for home page, first arg is path
app.get('/', (req, res) => {
    //renders home.ejs
    res.render('home')
})

//routing for making a new camp ground, first arg is path
app.get('/makecampground', async(req, res) => {
    const camp = new Campground({
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