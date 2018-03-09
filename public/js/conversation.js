
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
typeof actionMessage == "string" ? message = actionMessage : message = $('#fieldMessageInput').val();
return message;
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

function setClassificationResult(responseText){
var classificationResults = classificationResult.images[0].classifiers[0].classes[0].class;
var classificationResponseMessage = INTERPRET_AS_CLASSIFICATION + ' ' + classificationResults;
sendMessage(classificationResponseMessage);
}


function takeSnapshotAndSendToClassifier(){
  $.get('/utils/takeSnapshot').done(function (snapshot) {
      sendAjaxRequest('POST' ,'/watson/classifyImage', JSON.stringify(snapshot));
    })
}


function appendResponseInChatWindow(){
    $(".message").remove();
    $("#chat").append('<div class="message">' +
        '  <div class="header">Allison</div><br>' +
        '  <div class="content">' + textResponse + '</div>' +
        '</div><br>' +
        '<div> You are ' + (analyzedTone[0]) + ' in your voice.</div>');
}
