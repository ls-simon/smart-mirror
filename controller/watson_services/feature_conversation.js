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
    getToneAnalyzation(formattedMessage).then(sendAndReceiveMessage);


//   promise.then((toneAndMessage) => {sendAndReceiveMessage(toneAndMessage)})
  // .then((messageAndTone) => {res.send(messageAndTone)});
    //   console.log("Last then");

       conversation.message(formattedMessage,
         function(err, response) {
             if (err) {
                 console.log("Error sending message: " + err);
             } else {
                  console.log("Res");
                 res.send({response: response});
                  }
  })
}


  function getToneAnalyzation(formattedMessage){
  return new Promise(function(reject, resolve){
  console.log("texttoAna" + formattedMessage);
  var params = {
    'tone_input': formattedMessage.input.text,
    'content_type': 'text/plain'
  };

  toneAnalyzer.tone(params, function(error, response) {
    if (error){
      console.log('error:', error);
      return error;
    } else {

      response.message = formattedMessage;
        console.log(JSON.stringify("Tone analyzation: " + response.message));
      return response;
    }
  })
  })
  }

function checkIfMessageWasReceived(message){
  if (!message){
    throw new Error("Message was not received");
  }
}

function sendAndReceiveMessage(toneAndMessage){
  return new Promise(function(resolve, reject){
    conversation.message(toneAndMessage.message,
      function(err, response) {
          if (err) {
              reject("Error sending message: " + err);
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
