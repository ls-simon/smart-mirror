var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var credentials = require('../credentials.json');
var fs = require('fs');

exports.classifyImage = function (request, response) {

var visualRecognition = new VisualRecognitionV3({
    api_key: credentials.visual_recognition.api_key,
    version: credentials.visual_recognition.version,
    version_date: credentials.visual_recognition.version_date
});

var classifierOptions = {
    classifier_ids: credentials.visual_recognition.customClassifierIds,
    threshold: 0.4
};

var params = {
    images_file: fs.createReadStream('public/images/webcamImage.jpg'),
    parameters: classifierOptions
};


visualRecognition.classify(params, function(err, res) {
    if (err) {
        console.log("Error classifying image: " +err);

    } else {
        console.log(JSON.stringify(res, null, 2));
        response.send(res);
    }
});

}