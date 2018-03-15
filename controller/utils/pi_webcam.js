var RaspiCam = require("raspicam");
var shell = require('shelljs');
let now, timeStamp, filePath, camera;

exports.takeSnapshot = function(request, response){
    console.log("Taking picture..")
    //let timestamp = takeSnapshotWithTimestamp();
    timestamp = ""
    var snapshot = {};
    filePath = ('public/snapshots/'+timestamp+'.jpg').replace("\n", "");
    snapshot.filePath = filePath;
    response.send(snapshot);
};

function takeSnapshotWithTimestamp(){
     var snapshotWithTimestamp = shell.exec('sh ./controller/utils/picam.sh').stdout;


     return snapshotWithTimestamp;
}

if(typeof exports !== 'undefined') {
  exports.takeSnapshotWithTimestamp = takeSnapshotWithTimestamp();
}
