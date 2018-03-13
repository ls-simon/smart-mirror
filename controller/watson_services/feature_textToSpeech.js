var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var credentials = require('../watson_environment.json');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var textToSpeech = getTextToSpeechInstance();
var now, timestamp, filePath, speechOptions;

function getTextToSpeechInstance(){
  return new TextToSpeechV1({
      username: credentials.text_to_speech.username,
      password: credentials.text_to_speech.password,
      url: 'https://stream.watsonplatform.net/text-to-speech/api/'
  });
}

function getSpeechOptions(text){
  return {text: text, voice: 'en-US_AllisonVoice', accept: 'audio/wav'};
}

function getFilePathWithTimeStamp(){
  now = new Date();
  timestamp = Math.floor(now.getTime() + now.getHours() + now.getSeconds() + now.getMilliseconds() / 1000);
  return 'public/audio/audio'+timestamp+'.wav';
}

exports.synthesizeAndWrite = function (request, res) {

    speechOptions = getSpeechOptions(request.body.text);

    textToSpeech.synthesize(speechOptions, function(err, audio) {
            if (err) {
                console.log(err);
                res.send("Error occured synthesizing");
                return;
            }

    textToSpeech.repairWavHeader(audio);
            filePath = getFilePathWithTimeStamp();
            fs.writeFileSync(filePath, audio);
            var toBePlayed = {}; toBePlayed.filePath = filePath;
            res.send(toBePlayed);
        });
}

exports.getToken = function(request, res) {
  console.log("getToken")
    var speechToTextCredentials = extend(credentials.speech_to_text, vcapServices.getCredentials('speech_to_text'));
    // requestuest authorization to access the service
    var authorizationService = watson.authorization(speechToTextCredentials);
    authorizationService.getToken({
        url: speechToTextCredentials.url
    }, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token'+ReferenceError);
            return;
        }
        res.send(token);
    });
}
