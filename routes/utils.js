var express = require('express');
var router = express.Router();
var pi_webcam = require('./../controller/utils/pi_webcam');

router.get('/takeSnapshot', pi_webcam.takeSnapshot);
module.exports = router;
