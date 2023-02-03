const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// 'https://res.cloudinary.com/dbowbbm3q/image/upload/v1674606206/YelpCamp/fmudtuiblo2thjpukldl.jpg'

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//add img transformation with cloudinary - reminder of using virtual properties - not stored in the DB
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    location: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <a href="/campgrounds/${this._id}">${this.title}</a>
  <p>${this.description.substring(0, 20)}...</p>`;
});

//query mongoose middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  //remove all reviews in the doc just deleted
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
  // console.log(doc);
});

module.exports = mongoose.model('Campground', CampgroundSchema);
