var RaspiCam = require("raspicam");


var now = new Date();
var timeStamp = now.getDate() + now.getTime() + now.getHours() + now.getMilliseconds() * 1000;
var path = "public/snapshot"+timeStamp+".jpg";

var camera = new RaspiCam({
    mode: "photo",
    output: path,
    encoding: "jpg",
    thumb: "300:400:40"
});


exports.takeSnapshot = function(req, res){
    camera.start();
    res.send(path);
}

//listen for the "start" event triggered when the start method has been successfully initiated
camera.on("start", function(){
    //do stuff
});

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){
    //do stuff
});
