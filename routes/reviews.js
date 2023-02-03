const express = require('express');
//mergeParams fix access to all params express thing!!!
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//controller
const reviews = require('../controllers/reviews');

//models
const Campground = require('../models/campground');
const Review = require('../models/review');

// +++++++++++++review route associated with campground++++

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
