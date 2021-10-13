const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError =require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const validateCampground = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

const isAuthor = async (req, res, next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You cannot change this campground!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {        
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if(!campground)
    {
        req.flash('error', 'Oops! This campground was not found, probably it was deleted.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground)
    {
        req.flash('error', 'Oops! This campground was not found, probably it was deleted.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated a campground');
    res.redirect(`${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Your campground was deleted');
    res.redirect(`../campgrounds`);
}));

module.exports = router;