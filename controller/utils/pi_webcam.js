var RaspiCam = require("raspicam");
var shell = require('shelljs');

var now, timeStamp, filePath, camera;





exports.takeSnapshot = function(req, res){
    console.log("Taking picture..")
    //camera.start();
    //raspistill -vf -hf ./../../public/images/snapshots/$DATE.jpg
     //now = new Date();
    // timeStamp = Math.floor(now.getTime() + now.getHours() + now.getMinutes() + now.getSeconds() / 1000);

var filename = runRaspiCamScript();
    var data = {};

    filePath = ('public/snapshots/'+filename+'.jpg').replace("\n", "");
    data.filePath = filePath;
      console.log("FILENAME: " + filePath)

    res.send(data);
};

function runRaspiCamScript(){
	
     var filePath = shell.exec('sh ./controller/utils/picam.sh').stdout;

    return filePath;
}
