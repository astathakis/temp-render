const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  // res.send('you made it!!!');
  const campground = await Campground.findById(req.params.id);
  // console.log(req.params);
  const review = new Review(req.body.review);
  //accosiate review with user like in campgrounds
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'successfully added a new review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  /*using $pull operator from mongoose to delete the ref
     to the review in the array of objects*/
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  // res.send('delete me!!');
  req.flash('success', 'delete review done!!');
  res.redirect(`/campgrounds/${id}`);
};
