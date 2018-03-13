
//TODO: Connect to LED's
//File is not ready for implementation

var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');
var pushButton = new Gpio(17, 'in', 'both'); //Handles both in and output
var value;

pushButton.watch(function (err, value) {
  if (err) {
    console.error('There was an error', err);
  return;
  }
  // value = state bit
  LED.writeSync(value);
});

function freeUpResourcesOnExit() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
};

process.on('SIGINT', freeUpResourcesOnExit);
