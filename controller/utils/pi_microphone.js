var shell = require('shelljs');
//var cp = require('child_process');
var exec = require('child-process-promise').exec;

exports.startRecording = function(request, response){
  //include format=S16_LE
  //var mic = cp.spawn('arecord', ['--device=plughw:1,0', '--format=S16_LE', '--rate=44100', '--channels=1', 'test123.wav']); //, '--duration=10'

// mic.stdout.pipe(require('fs').createWriteStream('test.wav'));

exec('arecord -D plughw:1,0 -f cd -d 4 test.wav')
  .then(function () {
  res.send("recording completed successfully");
  })
  .catch(function (err) {
      console.error('ERROR: ', err);
  });

  //shell.exec('sh ./controller/utils/pi_record.sh').stdout;
}
