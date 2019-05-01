
var express = require('express');
var router = express.Router();
//var SunsetWx = require('node-sunsetwx');
const request = require("request");
var http = require("http");
var util = require('util');
var exec = require('child_process').exec;

const mongoose = require("mongoose");

var config = require('./config');

const googleAuth = require('./google-auth');
const app = express();
const passport = require('passport');
const cookieSession = require("cookie-session");

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieSession({
  maxAge: 24 * 60 * 60 *1000,
  keys:[config.mongodb.cookieKey]
}));

mongoose.connect(config.mongodb.dbURI, {useNewUrlParser: true }, () => {
  console.log('connected to mongodb');
});


//googleAuth.setup(app);
app.use(passport.initialize());
app.use(passport.session());

router.get('/google-auth',
    passport.authenticate('google', {
      scope : ['https://www.googleapis.com/auth/plus.login']
    }));


router.get('/auth/google/callback', function (req, res) {
  console.log("GOOGLE CALLBACK");
  passport.authenticate('google', function (err, profile) {
    res.redirect("/");
  })(req, res); // you to call the function retuned by passport.authenticate, with is a midleware.
});


  /* GET home page. (called by default) */
router.get('/', function (req, res, next) {

    res.render('index', {});
  });


  /* post prediction result page (called by submitting the form)*/
  router.post('/predict', function (req, res, next) {

    //REQUEST TO GOOGLE API TO TURN PLACE INTO COORDINATES
    var request = require("request");
    var options = {
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
      qs:
          {
            input: req.body.location, //whatever was typed into the input form
            inputtype: 'textquery',
            fields: 'formatted_address,name,rating,opening_hours,geometry',
            key: config.gmapsKey
          },

      headers:
          {
            'Postman-Token': '4a6773b8-b2b2-4278-b59b-65a3528bc9db',
            'cache-control': 'no-cache'
          }
    };

    request(options, function (error, response, body) {
      if (error) { //there was an error with the API call
        throw new Error(error);
      }
      //there was no error with the API call
      var obj = JSON.parse(body); //parsed the json response
      //console.log(body);
      //console.log(obj);
      if (obj.status === "ZERO_RESULTS") {
        //the API call did not return any results
        res.render('errorView', {place: req.body.location});
      } else {
        //the API call successfully returned a result
        var formattedPlace = obj.candidates[0].formatted_address;
        var locationObj = obj.candidates[0].geometry.location;

        //LOGIN TO SUNBURST API AND RETRIEVE TEMPORARY ACCESS TOKEN IN ORDER TO MAKE A PREDICTION (predict called within login)
        sunburstLogin(config.sbUsername, config.sbPassword, locationObj.lat, locationObj.lng, formattedPlace, res);

      }

    });


  });

//generates temporary access token and obtains a prediction object from prediction function
  function sunburstLogin(username, password, lat, long, place, res) {
    var token;
    var loginCommand = 'curl -X "POST" "https://sunburst.sunsetwx.com/v1/login" \\\n' +
        '  -u "' + username + ':' + password + '" \\\n' +
        '  -d "grant_type=password"\n';

    childLogin = exec(loginCommand, function (error, stdout, stderr) {

      console.log('LOGIN stdout: ' + stdout);
      console.log('LOGIN stderr: ' + stderr);

      if (error !== null) {
        throw new Error(error);
        console.log('exec error: ' + error);
      }
      console.log(JSON.parse(stdout));
      var loginObj = JSON.parse(stdout);
      token = loginObj.access_token;
      predictQuality(token, lat, long, place, res);
    });


  }

//returns a parsed json object of the prediction
  function predictQuality(token, lat, long, place, res) {
    var coordString = lat + "," + long; //abides by sunburst's coordinate format

    var qualityCommand = 'curl "https://sunburst.sunsetwx.com/v1/quality" \
  -d "geo=' + coordString + '" \
  -H "Authorization: Bearer ' + token + '" \
  -G';

    childQuality = exec(qualityCommand, function (error, stdout, stderr) {

      console.log('QUALITY stdout: ' + stdout);
      console.log('QUALITY stderr: ' + stderr);

      if (error !== null) {
        throw new Error(error);
        console.log('exec error: ' + error);
      }
      console.log("QUALITY OBJECT:");
      console.log(JSON.parse(stdout));
      var prediction = JSON.parse(stdout);

      var predictionType = prediction.features[0].properties.type;
      var rating = prediction.features[0].properties.quality_percent;
      var quality = prediction.features[0].properties.quality;
      var temperature = prediction.features[0].properties.temperature;

      console.log(prediction.features[0].properties);

      //RENDER THE RESULT PAGE
      res.render('predictionView', {
        place: place,
        latitude: lat,
        longitude: long,
        type: predictionType,
        rating: rating,
        quality: quality,
        temp: temperature
      });


    });

  }

module.exports = router;



