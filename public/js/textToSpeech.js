
    var fieldMessageInput = $('#fieldMessageInput');
    var play = $('#play');
    var stream = null;
    var readText = $('#readTxt')
    var conversationId = 0;
    var mic = $('#mic');
    mic.addClass("mic_enabled");

    var setMicState = function () {
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
        }
        return mic.attr('class').val()
    };

    function invokeSpeechToText(e) {
        e.preventDefault()
        $.when($.get('/watson/speechToTextToken')).done(function (token) {
            stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
                token: token, outputElement: '#fieldMessageInput'
            });

            stream.on('error', function (err) {
                console.log("Error in streaming speech to text: " + err);
            });
        });
    };

    var invokeTextToSpeech = function (input) {
        $('.player').remove();
        if (stream != undefined) {
            stream.stop();
        }
        var toBeTranslated = {};
        toBeTranslated.text = input;
        conversationId++;
        toBeTranslated.conversationId = conversationId;
        sendAjaxRequest('POST', '/watson/textToSpeechInput', JSON.stringify(toBeTranslated));
    }


    function appendAndPlayAudioFile(filePath) {
        $('.audioParent').append('<audio controls autoplay class="player"><source class="audiosource" src="'+filePath.substr(6)+'" type="audio/wav">\n' +
            '        Your browser does not support the audio element.\n' +
            '    </audio>\n' +
            '    </div>')
    }
