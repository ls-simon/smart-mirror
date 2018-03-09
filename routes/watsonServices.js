var express = require('express');
var router = express.Router();
var speechToText = require('./../controller/watson_services/feature_textToSpeech');
var conversation = require('./../controller/watson_services/feature_conversation');
var visualRecognition = require('./../controller/watson_services/feature_visualRecognition');
var bodyParser = require('body-parser');

router.get('/speechToTextToken*', speechToText.getToken);
router.post('/textToSpeechInput',speechToText.synthesizeAndWrite);
router.post('/conversationMessage', conversation.getResponse);
router.post('/classifyImage', visualRecognition.classifyImage);

module.exports = router;
