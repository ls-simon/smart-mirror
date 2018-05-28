var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var credentials = require('../watson_environment.json');
var textToSpeech = require('./feature_textToSpeech');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const maintainToneHistoryInContext = true;

var conversation = getConversationInstance();
var toneAnalyzer = getToneAnalyzerInstance();

function getResponse(req, res) {

  let message = req.body.message;
  let context = req.body.context;
  checkIfMessageWasReceived(message);
  var formattedMessage = getMessageWithWorkspaceID(JSON.stringify(message), context);

  conversation.message(formattedMessage, async function(err, response) {
    if (err) {
      console.log("Error sending message: " + err);
    } else {
      // I send the tone result to the client for now since it's only detected in longer messages
      // No functionality, just printing.

      var toneAnalyzation = await getToneAnalyzation(formattedMessage).then((tones) => {
        tones = !tones ? "no tone" : tones;
        res.send({
          response: response,
          tones: tones
        });
      }).catch((error) => {
        console.log('Error occured: ', error);
      });
    }
  })
}


function getToneAnalyzation(formattedMessage) {

  var params = {
    'tone_input': formattedMessage.input.text,
    'content_type': 'text/plain'
  };

  return new Promise(function(resolve, reject) {

    toneAnalyzer.tone(params, function(error, response) {
      if (!error) {
        resolve(response);
      } else {
        reject(new Error('Could not detect tone in message'));
      }
    })
  })
}

function checkIfMessageWasReceived(message) {
  if (!message) {
    throw new Error("Message was not received");
  }
}


function getMessageWithWorkspaceID(message, context) {
  return {
    input: {
      text: message
    },
    context: context,
    workspace_id: credentials.conversations.workspace
  };
}



function getConversationInstance() {
  return new ConversationV1({
    username: credentials.conversations.username,
    password: credentials.conversations.password,
    url: credentials.conversations.url,
    version_date: credentials.conversations.version
  });
}

function getToneAnalyzerInstance() {
  return new ToneAnalyzerV3({
    username: credentials.tone_analyzer.username,
    password: credentials.tone_analyzer.password,
    version_date: credentials.tone_analyzer.version
  })
}

if (typeof exports !== 'undefined') {
  exports.getResponse = getResponse;
  exports.getToneAnalyzerInstance = getToneAnalyzerInstance;
  exports.getConversationInstance = getConversationInstance;
  exports.getMessageWithWorkspaceID = getMessageWithWorkspaceID;
  exports.getToneAnalyzation = getToneAnalyzation;
}