var shell = require('shelljs');
let now, timeStamp, filePath, camera, snapshot;

exports.takeSnapshot = function(request, response){

    timestamp = takeSnapshotWithTimestamp();
    snapshot = {};
    filePath = ('public/snapshots/'+timestamp+'.jpg').replace("\n", "");
    snapshot.filePath = filePath;
    response.send(snapshot);

}

function takeSnapshotWithTimestamp(){
     var snapshotWithTimestamp = shell.exec('sh ./controller/utils/picam.sh').stdout;
     return snapshotWithTimestamp;

}

if(typeof exports !== 'undefined') {
  exports.takeSnapshotWithTimestamp = takeSnapshotWithTimestamp();
}
