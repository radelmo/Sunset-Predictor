
var express = require('express');
var router = express.Router();
var SunsetWx = require('node-sunsetwx');
const request = require("request");






const callback = (err, res) => console.log("Error: " + err + "Result " + res);

/* GET home page. (called by default) */
router.get('/', function(req, res, next) {
  var query = sunburstQuery("-40", "40");

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
        { input: "boston",
          inputtype: 'textquery',
          fields: 'formatted_address,name,rating,opening_hours,geometry',
          key: 'KEY' },
    headers:
        { 'Postman-Token': '4a6773b8-b2b2-4278-b59b-65a3528bc9db',
          'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    res.render('predictionView', {place: body});
  });
});



module.exports = router;
