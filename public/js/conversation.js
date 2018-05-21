

let textResponse, analyzedTone, message;

var sendMessage = function (actionMessage) {

    message = setMessageToInputOrAction(actionMessage);
    var request = {};
    request.message = message;
    console.log("Sending message: " + request.message);
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
    case '/watson/classifyImage': setClassificationResult(response)
    break;
    case '/watson/conversationMessage': setResponseResults(response, url)
    break;
    default:
    console.error("This is not a valid route")
    break;
  }
}

function setResponseResults(response) {

    textResponse = JSON.stringify(response.response.output.text[0]);
    var intent = typeof response.response.intents[0] === 'undefined' ? "no intent" : response.response.intents[0].intent;
    
    if (response.tones && typeof response.tones !== 'string'){
      if (response.tones.document_tone.tones[0]) { 

	//Optional: Do something with the tone result or append in appendResponseInChatWindow

	analyzedTone = response.tones.document_tone.tones[0].tone_name;
        console.log("\nAnalyzed tone is " + analyzedTone + "\n");
		}  
	}  

  	 handleResponseAsActionOrMessage(intent);
 
 }

 function handleResponseAsActionOrMessage(intent){
 
  if (intent == TAKE_FIRST_PICTURE || intent == TAKE_SECOND_PICTURE){
     takeSnapshotAndSendToClassifier(intent);
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
 
    $("#chat").append('<div class="message">' +
        '  <div class="header">Allison</div><br>' +
        '  <div class="content">' + textResponse + '</div>' +
        '</div><br>');
        //'<div> You are ' + tone + ' in your voice.</div>');
}

if(typeof exports !== 'undefined') {
  exports.setMessageToInputOrAction = setMessageToInputOrAction;
}
