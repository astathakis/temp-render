const express = require('express');
const router = express.Router();

//controllers
const campgrounds = require('../controllers/campgrounds');
//utils
const catchAsync = require('../utils/catchAsync');
//models
const Campground = require('../models/campground');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

//group with router.route
router.route('/').get(catchAsync(campgrounds.index)).post(
  isLoggedIn,

  upload.array('image'),
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// +++create new camp has two route handlers++++++
// one to serve our form - always before showCampground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,

    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// +++++++++++edit route++++++++++

//get the id and prepopulated the form with the information

//no need to use merger params here cause id is defined within our router in the path
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
