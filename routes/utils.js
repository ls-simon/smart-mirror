var express = require('express');
var router = express.Router();
var pi_webcam = require('./../controller/utils/pi_webcam');
var pi_microphone = require('./../controller/utils/pi_microphone');

router.get('/takeSnapshot', pi_webcam.takeSnapshot);
router.get('/startRecording', pi_microphone.startRecording);

module.exports = router;
