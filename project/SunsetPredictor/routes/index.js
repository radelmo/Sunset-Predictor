
var express = require('express');
var router = express.Router();
var SunsetWx = require('node-sunsetwx');
const request = require("request");






const callback = (err, res) => console.log("Error: " + err + "Result " + res);

/* GET home page. (called by default) */
router.get('/', function(req, res, next) {
  //var query = sunburstQuery("-40", "40");

  //Maps api call


  res.render('index', {});
});




function sunburstQuery(lat, long) {

  var sunsetwx = new SunsetWx({
    email: 'EMAIL',
    password: 'PW'
  });
  //console.log("valueOfSunset");
  //console.log(sunsetwx.valueOf());


  var qual = sunsetwx.quality({
    coords: '-77.331536,43.271152',
    type: 'sunset'
  }, callback)



};


/* post prediction result page (called by submitting the form)*/
router.post('/predict', function (req, res, next) {

  var request = require("request");
  var options = { method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    qs:
        { input: req.body.location, //whatever was typed into the input form
          inputtype: 'textquery',
          fields: 'formatted_address,name,rating,opening_hours,geometry',
          key: 'KEY' },
    headers:
        { 'Postman-Token': '4a6773b8-b2b2-4278-b59b-65a3528bc9db',
          'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) { //there was an error with the API call
      throw new Error(error);
    }
    //there was no error with the API call
    var obj = JSON.parse(body); //parsed the json response
    console.log(body);
    console.log(obj);
    if(obj.status === "ZERO_RESULTS"){
      //the API call did not return any results
      res.render('errorView', {place: req.body.location});
    }
    else {
      //the API call successfully returned a result
      var formattedPlace = obj.candidates[0].formatted_address;
      var locationObj = obj.candidates[0].geometry.location;

      res.render('predictionView', {place: formattedPlace, latitude: locationObj.lat, longitude: locationObj.lng});
    }
  });
});



module.exports = router;
