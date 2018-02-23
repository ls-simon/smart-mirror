var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var credentials = require('../credentials.json');
var fs = require('fs');


exports.synthesizeAndWrite = function (req, res) {
    console.log("SynthWrite " + req.body.text)
    var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

    var textToSpeech = new TextToSpeechV1({
        username: credentials.text_to_speech.username,
        password: credentials.text_to_speech.password,
        url: 'https://stream.watsonplatform.net/text-to-speech/api/'
    });

    // var text = responseMessage ? JSON.stringify(responseMESSAGE.MESSAGE) : req.body.text;
    var params = {
        text: req.body.text,
        voice: 'en-US_AllisonVoice',
        accept: 'audio/wav'
    };

// Synthesize speech, correct the wav header, then save to disk
// (wav header requires a file length, but this is unknown until after the header is already generated and sent)
    textToSpeech
        .synthesize(params, function(err, audio) {
            if (err) {
                console.log(err);
                res.send("error in writing file");
                return;
            }

            textToSpeech.repairWavHeader(audio);
            console.log("ID : ")
            fs.writeFileSync('public/audio'+req.body.conversationId+'.wav', audio);
            console.log('audio.wav written with a corrected wav header');
            res.send("file-ready");
        });

}




exports.token = function(req, res) {
    var sttCreds = extend(credentials.speech_to_text, vcapServices.getCredentials('speech_to_text'));
    // request authorization to access the service
    var sttAuthService = watson.authorization(sttCreds);

    sttAuthService.getToken({
        url: sttCreds.url
    }, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token'+ReferenceError);
            return;
        }
        res.send(token);
    });
}