var express = require('express');
var router = express.Router();
//var request = require(request);
var SunsetWx = require('node-sunsetwx');

/* GET home page. (called by default) */
router.get('/', function(req, res, next) {
  res.render('index', {});

  sunburstLogin();

});

function sunburstLogin() {

  var sunsetwx = new SunsetWx({
    email: 'xxx',
    password: "xxxxx"
  });

  console.log(sunsetwx);


  /*
  try {
    const sunburst = new SunburstJS();

    const session = await sunburst.createSession({
      email: 'dhennem@bu.edu',
      password: 'cs411isawesome',
      type: 'permanent',
      scope: ['predictions']
    });

    console.log(session);

  } catch (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  }
  */

};

/* post prediction result page (called by submitting the form)*/
router.post('/predict', function (req, res, next) {
  res.render('predictionView', {latitude: req.body.lat, longitude: req.body.long});
});



module.exports = router;
