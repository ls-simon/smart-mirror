'use strict';
var $ = require('jquery');
$(document).ready(function(){

})
    var txtArea = $('#txtArea');
    var mic = $('#mic');
    var play = $('#play');
    var stream = null;
    var readText = $('#readTxt')
    var conversationId = 0;
    mic.addClass("mic_enabled");


// SPEECH TO TEXT RECORDING
    mic.on("click", function () {
        var state = this.className;
        if (state.indexOf("mic_disabled") != -1) {
            if (!((typeof(stream) == "undefined") || (stream == null))) {
                stream.stop();
            }
            mic.addClass("mic_enabled");
            mic.removeClass("mic_disabled");
            console.log("stopped recording");


        }
        if (state.indexOf("mic_enabled") != -1) {
            console.log("recording..");
            mic.addClass("mic_disabled");
            mic.removeClass("mic_enabled");

            $.when($.get('/watson/speechToTextToken')).done(
                function (token) {
                    stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
                        token: token, outputElement: '#txtArea'
                    });

                    stream.on('error', function (err) {
                        console.log("Error in streaming speech to text: " + err);
                    });
                });
        }
    });

// TEXT TO SPEECH

    var invokeTextToSpeech = function (payload) {
        console.log(payload + " payload");

        $('.player').remove();

        if (stream != undefined) {
            stream.stop();
        }


        var data = {};
        data.text = payload;
        conversationId++;
        data.conversationId = conversationId;
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:6005/watson/textToSpeechInput',
            success: function (data) {
                if (data == "file-ready") {
                    appendAndPlayAudioFile()
                    return true;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 200) {
                    alert(ajaxOptions);
                }
                else {
                    console.log(xhr.status);
                    console.log(thrownError);
                    return false;
                }
            }
        })
    }


    function appendAndPlayAudioFile() {
        $('.audioParent').append('<audio controls autoplay class="player"><source class="audiosource" type="audio/wav">\n' +
            '        Your browser does not support the audio element.\n' +
            '    </audio>\n' +
            '    </div>')

        $('.audiosource').attr("src", 'audio' + conversationId + '.wav');
    }

module.exports = invokeTextToSpeech;