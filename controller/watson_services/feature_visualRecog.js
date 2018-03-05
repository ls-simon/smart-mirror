var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var credentials = require('../watson_environment.json');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
    api_key: credentials.visual_recognition.api_key,
    version: credentials.visual_recognition.version,
    version_date: credentials.visual_recognition.version_date
});

var classifierOptions = {
    classifier_ids: credentials.visual_recognition.customClassifierIds,
    threshold: 0.4
};

exports.classifyImage = function (req, res) {


var filePath = JSON.stringify(req.body.filePath.replace("\n", ""));
console.log(filePath);
// 'public/images/webcamImage.jpg'
var params = {
    images_file: fs.createReadStream(filePath),
    parameters: classifierOptions
};


visualRecognition.classify(params, function(err, response) {
    if (err) {
        console.log("Error classifying image: " +err);

    } else {
        console.log(JSON.stringify(response, null, 2));
        res.send(response);
    }
});

}
