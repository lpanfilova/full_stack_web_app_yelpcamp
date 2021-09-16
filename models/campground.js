const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const camp_ground_schema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

//exporting Schema from the module
module.exports = mongoose.model('Campground', camp_ground_schema);