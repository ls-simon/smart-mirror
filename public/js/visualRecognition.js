const MINIMUM_SCORE_BOUNDARY = 0.4;
let intentAndClassification = "NOCLASSIFICATION";

function setClassificationResult(response){

var classes = response.images[0].classifiers[0].classes;

if (response.intent == TAKE_FIRST_PICTURE){
	if (classes[0].score > MINIMUM_SCORE_BOUNDARY){

	   intentAndClassification = SUGGEST_CLOTHING_INTENT + " " + JSON.stringify(classes[0].class);
	 }
}

if (response.intent == TAKE_SECOND_PICTURE){
	if (classes[0].score + classes[0].score > (MINIMUM_SCORE_BOUNDARY * 2 - 0.2)){

	  intentAndClassification = CLOTH_RESULT_INTENT + " " + JSON.stringify(classes[0].class)
  	+ " " + JSON.stringify(classes[1].class);
	}
}

	sendMessage(intentAndClassification);

}

function takeSnapshotAndSendToClassifier(intent){

  $.get('/utils/takeSnapshot').done(function(snapshot) {
    snapshot.intent = intent;
      sendAjaxRequest('POST' ,'/watson/classifyImage', JSON.stringify(snapshot));
    })
}
