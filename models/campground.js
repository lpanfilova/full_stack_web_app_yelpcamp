const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//mongoose middleware to delete reviews associated with the deleted campground
campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//exporting Schema from the module
module.exports = mongoose.model("Campground", campgroundSchema);