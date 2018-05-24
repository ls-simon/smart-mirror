const extend = require('extend');
const watson = require('watson-developer-cloud');
const credentials = require('../watson_environment.json');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');

var textToSpeech = getTextToSpeechInstance();
var speechToText = getSpeechToTextInstance();
var now, timestamp, filePath, speechOptions;

function getTextToSpeechInstance(){
  return new TextToSpeechV1({
      username: credentials.text_to_speech.username,
      password: credentials.text_to_speech.password,
      url: 'https://stream.watsonplatform.net/text-to-speech/api/'
  });
}

function getSpeechToTextInstance(){
  return new SpeechToTextV1({
    username: credentials.speech_to_text.username,
    password: credentials.speech_to_text.password,
    url: 'https://stream.watsonplatform.net/speech-to-text/api/'
  });
}


function getTextToSpeechOptions(text){
  return {text: text, voice: 'en-US_AllisonVoice', accept: 'audio/wav'};
}

function getSpeechToTextOptions(){
  return { audio: fs.createReadStream('public/recordedAudio/toBeTranscribed.wav'),
           content_type: 'audio/l16; rate=44100'
  };
}

function getFilePathWithTimeStamp(){
  now = new Date();
  timestamp = Math.floor(now.getTime() + now.getHours() + now.getSeconds() + now.getMilliseconds() / 1000);
  return 'public/audio/audio'+timestamp+'.wav';
}

 function synthesizeAndWrite(request, res){
   console.log("Synthesize and write text: " + request.body.text);
    speechOptions = getTextToSpeechOptions(request.body.text);

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

function transcribeSpeechToText(request, response){

var params = getSpeechToTextOptions();

speechToText.recognize(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));

    let transcript = validateTranscription(res);
    response.send(transcript);
});

}

function validateTranscription(response){
	if (typeof response.results[0] !== 'undefined'){
		return response.results[0].alternatives[0].transcript;
	    } else {
		return "ERRORTRANSCRIBING";
}

}

if(typeof exports !== 'undefined') {
  exports.getTextToSpeechInstance = getTextToSpeechInstance;
  exports.getSpeechToTextInstance = getSpeechToTextInstance;
  exports.getTextToSpeechOptions = getTextToSpeechOptions;
  exports.getSpeechToTextOptions = getSpeechToTextOptions;
  exports.getFilePathWithTimeStamp = getFilePathWithTimeStamp;
  exports.synthesizeAndWrite = synthesizeAndWrite;
  exports.transcribeSpeechToText = transcribeSpeechToText;

}
