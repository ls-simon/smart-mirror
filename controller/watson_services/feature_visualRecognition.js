const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const credentials = require('../watson_environment.json');
const fs = require('fs');

const visualRecognition = getInstance();
const classifierOptions = getOptions();

function getInstance(){
  return new VisualRecognitionV3({
    api_key: credentials.visual_recognition.api_key,
    version: credentials.visual_recognition.version,
    version_date: credentials.visual_recognition.version_date
});
}

function getOptions(){
 
 return {
      classifier_ids: credentials.visual_recognition.customClassifierIds,
      threshold: 0.4
  };

}

function classifyImage(req, res) {

  let assumedClothItem = req.body.assumedClothItem;
  let params = {
    images_file: fs.createReadStream(req.body.filePath),
    parameters: classifierOptions
  };

visualRecognition.classify(params, function(error, response) {
  
    if (error) {
        console.log("Error classifying image: " + error);
    } else {
        response.intent = req.body.intent;
        res.send(response);
    }
});

}



if(typeof exports !== 'undefined') {
  exports.getInstance = getInstance;
  exports.getOptions = getOptions;
  exports.classifyImage = classifyImage;
}
