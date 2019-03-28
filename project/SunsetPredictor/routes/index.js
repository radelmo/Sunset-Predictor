var express = require('express');
var router = express.Router();
//var request = require(request);
var SunsetWx = require('node-sunsetwx');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Prediction Form' });

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



module.exports = router;
