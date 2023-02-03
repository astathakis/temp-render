// ************independant seed file *******************

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  //mongoose 6 no longer support
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

//this is to use seedHelpers -pass in the array and return a random element of the array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//function to empty db and then seed our db
const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '63c724738a5a9490ab980a38',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad earum sint, quisquam dolorem nulla libero amet quidem quasi dolor aperiam?',
      price,

      geometry: {
        type: 'Point',
        coordinates: [
          // opposite in mapbox
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },

      images: [
        {
          url: 'https://res.cloudinary.com/dbowbbm3q/image/upload/v1674649907/YelpCamp/y3fg6kgybn7oficwhkon.jpg',
          filename: 'YelpCamp/y3fg6kgybn7oficwhkon',
        },
        {
          url: 'https://res.cloudinary.com/dbowbbm3q/image/upload/v1674647476/YelpCamp/kztfjqvi9bpgokre9kyu.jpg',
          filename: 'YelpCamp/kztfjqvi9bpgokre9kyu',
        },
      ],
    });
    await camp.save();
  }
};

//after seeding just close the connection
seedDb().then(() => {
  mongoose.connection.close();
});
