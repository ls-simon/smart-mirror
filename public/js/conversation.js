

let textResponse, analyzedTone, message;
const SNAPSHOT_ANALYZATION_REQUEST = "pictureAnalyzeRequest";
const INTERPRET_AS_CLASSIFICATION = 'analyzationCompleteWithResults';

var sendMessage = function (actionMessage) {
    message = setMessageToInputOrAction(actionMessage);
    var request = {};
    request.message = message;
    sendAjaxRequest("POST", '/watson/conversationMessage', JSON.stringify(request));
    }

function setMessageToInputOrAction(actionMessage){
  let msg;
  if (typeof actionMessage == "string"){
  msg = actionMessage
    } else {
      msg = $('#fieldMessageInput').val();
}
  return msg;
}


function processResponse(response, url){
  switch (url){
    case '/watson/classifyImage': setClassificationResult(response, url)
    break;
    case '/watson/conversationMessage': setResponseAndToneResults(response, url)
    break;
    default:
    console.error("This is not a valid route")
    break;
  }
}

function setResponseAndToneResults(response) {
    textResponse = JSON.stringify(response.response.output.text[0]);
    analyzedTone = response.tone.document_tone.tones.map(function (value) {
        return value.tone_id
   });
   handleResponseAsActionOrMessage();
 }

 function handleResponseAsActionOrMessage(){
   if (textResponse.indexOf(SNAPSHOT_ANALYZATION_REQUEST) != -1){
     takeSnapshotAndSendToClassifier();
   } else {
     appendResponse();
   }
   }


function appendResponse(){
  invokeTextToSpeech(textResponse);
  appendResponseInChatWindow();
}




function appendResponseInChatWindow(){
    $(".message").remove();
    let tone = analyzedTone[0] ? analyzedTone[0] : "not set"
    $("#chat").append('<div class="message">' +
        '  <div class="header">Allison</div><br>' +
        '  <div class="content">' + textResponse + '</div>' +
        '</div><br>' +
        '<div> You are ' + tone + ' in your voice.</div>');
}
if(typeof exports !== 'undefined') {
  exports.setMessageToInputOrAction = setMessageToInputOrAction;
}
