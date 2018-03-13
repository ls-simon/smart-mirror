

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
