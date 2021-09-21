const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String
});

//exporting Schema from the module
module.exports = mongoose.model("Campground", campgroundSchema);