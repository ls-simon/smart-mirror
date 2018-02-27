var RaspiCam = require("raspicam");


var now = new Date();
var timeStamp = (now.getTime() + now.getHours() + now.getMinutes() + now.getSeconds() / 1000);
var path = "public/snapshots/snapshot"+timeStamp+".jpg";

var camera = new RaspiCam({
    mode: "photo",
    output: path,
    encoding: "jpg",
    thumb: "300:400:40"
});


exports.takeSnapshot = function(req, res){
    console.log("Taking picture..")
    camera.start();
    res.send(path);
};
