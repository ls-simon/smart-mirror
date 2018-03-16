var RaspiCam = require("raspicam");
var shell = require('shelljs');
let now, timeStamp, filePath, camera, snapshot;

exports.takeSnapshot = function(request, response){
    timestamp = takeSnapshotWithTimestamp();
    snapshot = {};
    filePath = ('public/snapshots/'+timestamp+'.jpg').replace("\n", "");
    snapshot.filePath = filePath;
    response.send(snapshot);
};

function takeSnapshotWithTimestamp(){
     var snapshotWithTimestamp = shell.exec('sh ./controller/utils/picam.sh').stdout;
//script to insert when deploying to raspberry pi:
//sudo raspistill -t 1 -o ./public/snapshots/$DATE.jpg

     return snapshotWithTimestamp;
}

if(typeof exports !== 'undefined') {
  exports.takeSnapshotWithTimestamp = takeSnapshotWithTimestamp();
}
