const MINIMUM_SCORE_BOUNDARY = 0.4;

function setClassificationResult(response){

var intentAndClassification = "NOCLASSIFICATION";
var classes = response.images[0].classifiers[0].classes;

if (response.intent == TAKE_FIRST_PICTURE){
intentAndClassification = SUGGEST_CLOTHING_INTENT + " " + JSON.stringify(classes[0].class);
}

if (response.intent == TAKE_SECOND_PICTURE){
  intentAndClassification = CLOTH_RESULT_INTENT + " " + JSON.stringify(classes[0].class)
  + " " + JSON.stringify(classes[1].class);
}

sendMessage(intentAndClassification);

}


function takeSnapshotAndSendToClassifier(intent){
  console.log("Take snapshot  " + intent);
  $.get('/utils/takeSnapshot').done(function(snapshot) {
    console.log("Snapshot  " + snapshot);
    snapshot.intent = intent;
      sendAjaxRequest('POST' ,'/watson/classifyImage', JSON.stringify(snapshot));
    })
}
