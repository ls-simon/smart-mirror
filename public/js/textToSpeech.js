
    var fieldMessageInput = $('#fieldMessageInput').val();
    var play = $('#play');
    var stream = null;
    var readText = $('#readTxt')
    var conversationId = 0;
    var mic = $('#mic');

    function invokeSpeechToText() {
      console.log('invokeSpeechToText');
      $.get('/utils/startRecording', function(){
        console.log('finish recording');
        $.get('/watson/transcribeSpeechToText', function(transcription){
          console.log(JSON.stringify(transcription) + '  transcription');
          request = {};
          request.message = JSON.stringify(transcription);
          sendAjaxRequest('POST', '/watson/conversationMessage', request);
            })
          })
    }


    var invokeTextToSpeech = function (input) {
      console.log("INPUT : " + input);
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
