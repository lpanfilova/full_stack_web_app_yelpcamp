const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
});

//exporting Schema from the module
module.exports = mongoose.model("Review", reviewSchema);