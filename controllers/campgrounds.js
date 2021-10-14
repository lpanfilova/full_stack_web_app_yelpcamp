const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.addCampground = async (req, res, next) => {        
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.findCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    .populate({path: 'reviews', populate: {path: 'author'}}) //review author
    .populate('author'); //campground author
    if(!campground)
    {
        req.flash('error', 'Oops! This campground was not found, probably it was deleted.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground)
    {
        req.flash('error', 'Oops! This campground was not found, probably it was deleted.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.editCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated a campground');
    if(campground)
    {
        res.redirect(`${campground._id}`);
    }
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if(campground)
    {
        req.flash('success', 'Your campground was deleted');
        res.redirect(`../campgrounds`);
    }
    
}



