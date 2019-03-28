
var express = require('express');
var router = express.Router();
var SunsetWx = require('node-sunsetwx');
const request = require("request");


const callback = (err, res) => console.log("Error: " + err + "Result " + res);

/* GET home page. (called by default) */
router.get('/', function(req, res, next) {
  sunburstQuery("-40", "40");
  res.render('index', {});
});

function sunburstQuery(lat, long) {

  /*
  try {
    const sunburst = new SunburstJS();

    const session = await sunburst.createSession({
      email: 'email@example.com',
      password: '3sLWT-Xt*$FD_SMX4F',
      type: 'permanent',
      scope: ['predictions']
    });

    console.log(session);

  } catch (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  };
  */

  var sunsetwx = new SunsetWx({
    email: 'dhennem@bu.edu',
    password: 'cs411isawesome'
  });

  console.log(sunsetwx.valueOf());

  /*
  sunsetwx.quality({
    coords: '-77.331536,43.271152',
    type: 'sunset'
  }, callback)
*/

};


/* post prediction result page (called by submitting the form)*/
router.post('/predict', function (req, res, next) {
  res.render('predictionView', {latitude: req.body.lat, longitude: req.body.long});
});



module.exports = router;
