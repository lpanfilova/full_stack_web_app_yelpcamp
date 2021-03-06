const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.addCampground));

router.get('/:id', catchAsync(campgrounds.findCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampgrounds));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;