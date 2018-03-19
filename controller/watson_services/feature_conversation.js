var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var credentials = require('../watson_environment.json');
var textToSpeech = require('./feature_textToSpeech');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var toneDetection = require('./feature_toneAnalyzer');
const maintainToneHistoryInContext = true;

var conversation = getConversationInstance();
var toneAnalyzer = getToneAnalyzerInstance();

function getResponse(req, res){
     var stringifiedMessage = JSON.stringify(req.body.message);
     if (!stringifiedMessage){
       throw new Error("Message was not received");
     }
     var messageToWatson = getMessageWithWorkspaceID(stringifiedMessage);


       var toneAnalyzed = getToneAnalyzation(messageToWatson);
       toneAnalyzed.then(function(tone){

       conversation.message(messageToWatson,
           function(err, response) {
               if (err) {
                   console.error("Error sending message: " + err);
               } else {
                   res.send({response: response, tone: tone});
                    }
           }
       );
     })
  }


function getMessageWithWorkspaceID(message){
  return { input: {
            text: message },
          workspace_id: credentials.conversations.workspace
        };
}

function getToneAnalyzation(messageToWatson){
  return new Promise(function(resolve, reject){
    if (!messageToWatson.input.text || messageToWatson.input.text == ""){
      reject();
    } else {
    toneDetection.invokeToneAsync(messageToWatson, toneAnalyzer).then(function (tone) {
           toneDetection.updateUserTone(
           messageToWatson,
           tone,
           maintainToneHistoryInContext
       );
         resolve(tone);
     })
   }
}).catch(function(){
  throw new Error("Input message was not set");
})
}


function getConversationInstance(){
  return new ConversationV1({
    username: credentials.conversations.username,
    password: credentials.conversations.password,
    url: credentials.conversations.url,
    version_date: credentials.conversations.version
});
}

function getToneAnalyzerInstance(){
  return new ToneAnalyzerV3({
      username: credentials.tone_analyzer.username,
      password: credentials.tone_analyzer.password,
      version_date: credentials.tone_analyzer.version
  })
}

if(typeof exports !== 'undefined') {
  exports.getResponse = getResponse;
  exports.getToneAnalyzerInstance = getToneAnalyzerInstance;
  exports.getConversationInstance = getConversationInstance;
  exports.getMessageWithWorkspaceID = getMessageWithWorkspaceID;
  exports.getToneAnalyzation = getToneAnalyzation;
}
