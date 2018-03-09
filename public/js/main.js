
   var btnSendMessage = $('#btnSendMessage');
   var mic = $('#mic');
   mic.addClass("mic_enabled");
   btnSendMessage.on('click', sendMessage);
   mic.on('click', setMicState);
