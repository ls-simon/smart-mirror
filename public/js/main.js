   const TAKE_FIRST_PICTURE = "pictureAnalyzeRequest";
   const SUGGEST_CLOTHING_INTENT = "suggestClothing";
   const CLOTH_RESULT_INTENT = "clothResult";
   const TAKE_SECOND_PICTURE = "takeSecondPicture";

   var btnSendMessage = $('#btnSendMessage');
   var mic = $('#mic');

   mic.addClass("mic_enabled");

   btnSendMessage.on('click', sendMessage);
   mic.on('click', invokeSpeechToText);