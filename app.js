const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError =require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')

//connecting database
mongoose.connect('mongodb://localhost:27017/yelp_camp', {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
//if opened successfully, print `Database connected`
db.once("open", () => {
    console.log("Database connected");
});

//creating response object
const app = express();

//using ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
//joining current directory with /views
app.set('views', path.join(__dirname, 'views'));

//middleware, app.use runs on every single incoming request
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: "shouldbesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
//authorization with passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

//setting up routes, routes are matched in order
app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (err, req, res, next) =>{
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) =>{
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
});


app.listen(3000, ()=> {
    console.log('Listening on port 3000')
});