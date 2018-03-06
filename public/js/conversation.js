var btnSendMessage = $('#btnSendMessage');

var invokeConversation = function (internalMessage) {
    var textResponse, tone;

    var message = typeof internalMessage == "string" ? internalMessage : $('#txtArea').val();

    if (!message) {
        message = "test";
    }
    var req = {};
    req.message = message;
    var data = JSON.stringify(req);
    console.log('btn clicked, message: ' + JSON.stringify(req));


    //$.post('/watson/conversationMessage', JSON.stringify(obj));
    $.ajax({
        type: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: "/watson/conversationMessage",
        success: function (response) {
            textResponse = JSON.stringify(response.response.output.text[0]);
            tone = response.tone.document_tone.tones.map(function (value) {
                return value.tone_id
           });

            console.log("Response from server " + textResponse);
            if (textResponse == '"pictureAnalyzeRequest"') {
                $.when($.get('/utils/takeSnapshot')).done(function (data) {
                  console.log(data);

                  var snapshot = {};
                  snapshot.filePath = data.filePath;

                    $.when($.post('/watson/classifyImage', snapshot)).done(function (classificationResult) {
                        var classResult = 'analyzationCompleteWithResults ' +
                            (classificationResult.images[0].classifiers[0].classes[0].class);
                        console.log(classResult);
                        invokeConversation("pictureAnalyzeRequest analyzationCompleteWithResults " + classResult);
                    })
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


function appendResponse(textResponse, tone){
    $(".message").remove();
    $("#chat").append('<div class="message">' +
        '  <div class="header">Allison</div><br>' +
        '  <div class="content">' + textResponse + '</div>' +
        '</div><br>' +
        '<div> You are ' + (tone[0]) + ' in your voice.</div>');

}
