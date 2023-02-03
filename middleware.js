const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
//joi schema
const { reviewSchema } = require('./schemas.js');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  // passport provides req.user
  // console.log('Req.User..', req.user);
  if (!req.isAuthenticated()) {
    /*we want the original for the session
    store the url they are requesting
    remember statefullness to our request
    returnTo helper method*/

    // console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'you must be signed in!!!');
    return res.redirect('/login');
  }
  next();
};

//build validation middleware (server side)
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  //error.details is an array of objects
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  // console.log(error);
};

//authorization middleware
module.exports.isAuthor = async (req, res, next) => {
  // if author matches the currently logged user then update
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'you have no permission!!!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
//review authorization middleware
module.exports.isReviewAuthor = async (req, res, next) => {
  // if author matches the currently logged user then update
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'you have no permission!!!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//validate middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
