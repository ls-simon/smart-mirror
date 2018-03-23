var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var credentials = require('../watson_environment.json');
var textToSpeech = require('./feature_textToSpeech');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const maintainToneHistoryInContext = true;

var conversation = getConversationInstance();
var toneAnalyzer = getToneAnalyzerInstance();

function getResponse(req, res){
    let message = req.body.message;
    console.log("Req mes " + req.body.message);
    checkIfMessageWasReceived(message);
    var formattedMessage = getMessageWithWorkspaceID(JSON.stringify(message));
    console.log("Formatted " + formattedMessage);
    toneAnalyzationPromise(formattedMessage).then(sendAndReceiveMessage(toneAndMessage)).then(function(messageAndTone){
      console.log("Last then");
      res.send(messageAndTone);
    });
  }

function checkIfMessageWasReceived(message){
  if (!message){
    throw new Error("Message was not received");
  }
}

function sendAndReceiveMessage(toneAndMessage){
  console.log(toneAnalyzed + " " + formattedMessage);
  var conversationPromise = new Promise(function(reject, resolve){
    conversation.message(toneAndMessage.message,
      function(err, response) {
          if (err) {
              console.error("Error sending message: " + err);
          } else {
              resolve({response: response, tone: toneAndMessage});
               }
      });
})
}

function getMessageWithWorkspaceID(message){
  return { input: {
            text: message },
          workspace_id: credentials.conversations.workspace
        };
}

function getToneAnalyzation(formattedMessage){
var promise = new Promise(function(reject, resolve){
console.log("texttoAna" + formattedMessage);
var params = {
  'tone_input': formattedMessage.input.text,
  'content_type': 'text/plain'
};

toneAnalyzer.tone(params, function(error, response) {
  if (error){
    console.log('error:', error);
    reject(error);
  } else {
    console.log(JSON.stringify("Tone analyzation: " +response));
    response.message = formattedMessage;
    resolve(response);
  }
})
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
