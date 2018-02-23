

var invokeTextToSpeech = require('./textToSpeech');
var visualRecog = require('./visualRecog');

var $ = require("jquery");
global.$ = $;
global.jQuery = $;
$(document).ready(function(){


//var textToSpeech = require('./textToSpeech');


    var btnSendMessage = $('#btnSendMessage');

    btnSendMessage.on('click', function () {

        invokeConversation();


        function invokeConversation (internalMessage){
            var message = internalMessage ? internalMessage : $('#txtArea').val();

            var request = {};
            request.message = message;
            console.log('btn clicked, message: ' + JSON.stringify(request))
            $.ajax({
                type: 'POST',
                data: JSON.stringify(request),
                contentType: 'application/json',
                url: 'http://localhost:6005/watson/conversationMessage',
                success: function (response) {
                    var textResponse = JSON.stringify(response.response.output.text[0]);
                    var tone = response.tone.document_tone.tones.map(function (value) {
                        return value.tone_id
                    });

                    console.log("Response from server " + textResponse);


                    if (textResponse == '"pictureAnalyzeRequest"'){
                        $.when($.get('/watson/classifyImage')).done(function (data) {
                            var classResult = 'analyzationCompleteWithResults ' +
                                (data.images[0].classifiers[0].classes[0].class);
                            console.log(classResult);
                            //var classScore = JSON.stringify(data.images[0].classifiers[0].classes[0].score);
                            //$('#chat').append('<div>Name:  ' + className + '<br>Score:   ' + classScore+'</div>');

                            invokeConversation("pictureAnalyzeRequest analyzationCompleteWithResults Cat");
                        })
                    } else {
                        invokeTextToSpeech(textResponse);
                        appendResponse(textResponse, tone);
                    }
                }
                ,
                error: function (xhr, ajaxOptions, thrownError) {
                    //On error do this
                    if (xhr.status == 200) {
                        alert(ajaxOptions);
                    }
                    else {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                }
            })
        }
        })

function appendResponse(textResponse, tone){
    $(".message").remove();
    $("#chat").append('<div class="message">' +
        '  <div class="header">Allison</div><br>' +
        '  <div class="content">' + textResponse + '</div>' +
        '</div><br>' +
        '<div> You are ' + (tone[0]) + ' in your voice.</div>');

}





})

