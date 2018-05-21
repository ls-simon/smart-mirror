const exec = require('child-process-promise').exec;

exports.startRecording = function(request, response){

console.log("recording..");

exec('arecord -D plughw:1,0 -f cd -d 6 public/recordedAudio/toBeTranscribed.wav')
  .then(function () {
  response.send("Recording completed successfully");
  })
  .catch(function (err) {
      console.error('ERROR: ', err);
  });

}
