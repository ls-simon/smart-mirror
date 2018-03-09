var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var credentials = require('../watson_environment.json');
var textToSpeech = require('./feature_textToSpeech');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var toneDetection = require('./feature_toneAnalyzer');
const maintainToneHistoryInContext = true;

var conversation = new ConversationV1({
    username: credentials.conversations.username,
    password: credentials.conversations.password,
    url: credentials.conversations.url,
    version_date: credentials.conversations.version
});

var toneAnalyzer = new ToneAnalyzerV3({
    username: credentials.tone_analyzer.username,
    password: credentials.tone_analyzer.password,
    version_date: credentials.tone_analyzer.version
})

exports.getResponse = function(req, res){
    var inputData = {
        input: { text: JSON.stringify(req.body.message) },
        workspace_id: credentials.conversations.workspace
    };

    toneDetection.invokeToneAsync(inputData, toneAnalyzer).then(function (tone) {
            toneDetection.updateUserTone(
            inputData,
            tone,
            maintainToneHistoryInContext
        );

    conversation.message( inputData,
        function(err, response) {
            if (err) {
                console.error("Error sending message: " + err);
            } else {
                res.send({response: response, tone: tone});
                 }
        }
    );
});
};
