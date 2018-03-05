var RaspiCam = require("raspicam");
var shell = require('shelljs');

var now, timeStamp, path, camera;





exports.takeSnapshot = function(req, res){
    console.log("Taking picture..")
    //camera.start();
    //raspistill -vf -hf ./../../public/images/snapshots/$DATE.jpg
     //now = new Date();
    // timeStamp = Math.floor(now.getTime() + now.getHours() + now.getMinutes() + now.getSeconds() / 1000);

    var filename = runRaspiCamScript();
    path = "public/snapshots/snapshot"+filename+".jpg";

    res.send(path);
};

function runRaspiCamScript(){
    shell.exec('chmod +x ./controller/utils/picam.sh');
    return shell.exec('sh ./controller/utils/picam.sh').stdout;

    //return script;
}
