

   var btnSendMessage = $('#btnSendMessage');
   var mic = $('#mic');
   mic.addClass("mic_enabled");
   btnSendMessage.on('click', invokeConversation);
   mic.on('click', invokeSpeechToText);