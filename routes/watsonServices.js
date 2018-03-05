var express = require('express');
var router = express.Router();
var speechToText = require('./../controller/watson_services/feature_textToSpeech');
var conversation = require('./../controller/watson_services/feature_conversation');
var visualRecog = require('./../controller/watson_services/feature_visualRecog');
var bodyParser = require('body-parser');

router.get('/speechToTextToken*', speechToText.token);
router.post('/textToSpeechInput',speechToText.synthesizeAndWrite);
router.post('/conversationMessage', conversation.getResponse);
router.post('/classifyImage', visualRecog.classifyImage);

module.exports = router;
