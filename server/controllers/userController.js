/* eslint-disable no-console */
const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../models/userModels');

const userController = {};

userController.checkUserName = (req, res, next) => {
  const nameTaken = `Sorry, this username is already taken.`;
  const query = `
  SELECT username FROM users WHERE username = '${req.body.newUser}'`;

  db.query(query, () => {
    if (query) {
      res.statusText === nameTaken;
      console.log(`user name double check`);
      //return next(err);
    } else {
      console.log(`Acceptable`);
    }
  }).catch((err) => {
    if (err) return next(err);
  });
  
  /**
   * db.query(loginQuery, (err, data) => {
    if (err) {
      console.log(`Database request error! ${err}`);
      return next(err);
    }
    if (data.rows[0]) {
      next();
    } else {
      res.redirect(205, '/login');
    }
   */
  
  
  userController.bcrypt = (req, res, next) => {
    bcrypt.hash(req.body.newPassword, 11, function (err, hash) {
      if (err) {
        return res.status(400).send("Error: Unable to store password.");
      }
      console.log(hash);
      res.locals.hash = hash;
      return next();
    })
  }

  userController.signup = (req, res, next) => {
    console.log('Signup body', req.body);
    console.log('Signup query', req.query);

    const query = `
  INSERT INTO users(username, email, password, netflix, hulu, amazon)
  VALUES ('${req.body.newUser}',
  '${req.body.email}',
  '${res.locals.hash}',
  '${JSON.parse(req.body.netflix)}',
  '${JSON.parse(req.body.hulu)}',
  '${JSON.parse(req.body.amazon)}')
  `;

    db.query(query)
      .then(() => {
        next();
      })
      .catch((err) => {
        if (err) return next(err);
      });
  };
}


//userController signup
//db query if db users Object.hasOwnProperty('req.body.newPassword')
// catch() ()


userController.login = (req, res, next) => {
  console.log(req.body);
  const loginQuery = `
  SELECT username, password
  FROM users
  WHERE username = '${req.body.username}' AND password = '${req.body.password}'
  `;
  console.log('Made it to the login controller');
  db.query(loginQuery, (err, data) => {
    if (err) {
      console.log(`Database request error! ${err}`);
      return next(err);
    }
    if (data.rows[0]) {
      next();
    } else {
      res.redirect(205, '/login');
    }
    // console.log(`Successfully got data from database ${data.rows}`);
    // res.locals.user = data.rows;
    // return next();
  });
};

userController.setServices = (req, res, next) => {
  const query = `
  SELECT netflix, hulu, amazon
  FROM users
  WHERE username = '${req.body.username}'
  `;

  console.log('made it to the seteefser controller');

  db.query(query).then((data) => {
    // console.log(typeof data.rows[0].netflix);
    console.log(data.rows[0]);
    data.rows[0].prime = data.rows[0].amazon;
    delete data.rows[0].amazon;
    res.cookie('userServices', JSON.stringify(data.rows[0]));
    next();
  });
};

userController.searchServices = (req, res, next) => {
  // check the properties in the cookie to check which services the user has, save that in a variable, array of strings if true
  console.log('Search query: ', req.body.search);
  const array = [];
  const userServices = JSON.parse(req.cookies.userServices);
  console.log('searchServices cookie: ', userServices);
  Object.keys(userServices).forEach((service) => {
    // console.log('Service: ', service);
    if (userServices[service]) {
      array.push(service);
    }
  });

  console.log('User services array: ', array);
  // if array has no values, return 'no results' with no api call
  if (array.length === 0) {
    // res.locals.body = 'No results';
    next();
  }

  const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/get/basic',
    params: { country: 'us', imdb_id: `${res.locals.imdb}` },
    headers: {
      'x-rapidapi-key': 'e0d178da4amsh91f0fb94afc02adp192ddbjsn3dcf07dc4de5',
      'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.locals.kyung = {};
      // console.log('API Response.data: ', response.data);
      console.log('posterURL', response.data.posterURLs['500']);
      console.log('streaming info: ', response.data.streamingInfo);

      // STEP 1: Add corresponding streaming services to obj
      Object.keys(response.data.streamingInfo).forEach((el) => {
        // Test if the streaming servics from the returned object match the user's cookies streaming services, if so add to returned object
        if (array.includes(el)) {
          res.locals.kyung[el] = true;
        }
      });
      // STEP 2: Add poster and title to the obj
      res.locals.kyung.poster = response.data.posterURLs['342'];
      res.locals.kyung.title = response.data.title;

      next();
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
};

userController.getIMDB = (req, res, next) => {
  const options = {
    method: 'GET',
    url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
    params: { s: `${req.body.search}`, page: '1', type: 'movie', r: 'json' },
    headers: {
      'x-rapidapi-key': 'e0d178da4amsh91f0fb94afc02adp192ddbjsn3dcf07dc4de5',
      'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com',
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log('imdb', response.data);
      res.locals.imdb = response.data.Search[0].imdbID;
      next();
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
};

module.exports = userController;
