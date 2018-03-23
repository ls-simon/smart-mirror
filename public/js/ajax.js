$.ajaxSetup({
  })

function sendAjaxRequest(type, url, requestData){

  if (type == "GET"){ requestData = ""; }
  $.ajax({
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type: type,
      data: requestData,
      url: url,
      success: function (response){
        if (url == '/watson/textToSpeechInput'){
                  appendAndPlayAudioFile(response.filePath);
        } else {  processResponse(response, url); }
      },
      error: function (xhr, ajaxOptions, thrownError){
        throwXHRError(xhr, ajaxOptions, thrownError, url);
      }
})
}

function throwXHRError(xhr, ajaxOptions, thrownError, url) {
          if (xhr.status == 200) {
              alert("Status code 200, ajax options are: " + ajaxOptions);
          } else {

              console.log("Error occured sending to " + url + " with status: " + xhr.status);
              console.log("Thrown error: " + thrownError);
          }
      }
