
//including node.js modules
const express = require('express');
//path module joins multiple paths together
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

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
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));

//routes are matched in order
//routing for home page, first arg is path
app.get('/', (req, res) => {
    //renders home.ejs
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground});
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
});




//start a server
app.listen(3000, ()=> {
    console.log('Listening on port 3000')
});