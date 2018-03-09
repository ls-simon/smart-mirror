var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var credentials = require('../watson_environment.json');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var textToSpeech = new TextToSpeechV1({
    username: credentials.text_to_speech.username,
    password: credentials.text_to_speech.password,
    url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});

var speechOptions = {
text: req.body.text,
voice: 'en-US_AllisonVoice',
accept: 'audio/wav'
};

var now, timestamp;

exports.synthesizeAndWrite = function (req, res) {

    textToSpeech.synthesize(speechOptions, function(err, audio) {
            if (err) {
                console.log(err);
                res.send("Error occured synthesizing");
                return;
            }

    textToSpeech.repairWavHeader(audio);
            fs.writeFileSync(filePath, audio);
            filePath = getPathWithTimeStamp();
            var response = {}; response.filePath = filePath;
            res.send(response);
        });
}


function getPathWithTimeStamp(){
  now = new Date();
  timestamp = Math.floor(now.getTime() + now.getHours() + now.getSeconds() + now.getMilliseconds() / 1000);
  return 'public/audio/audio'+timestamp+'.wav';
}


exports.getToken = function(req, res) {
    var speechToTextCredentials = extend(credentials.speech_to_text, vcapServices.getCredentials('speech_to_text'));
    // request authorization to access the service
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
