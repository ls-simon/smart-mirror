const conversation = require('./../public/js/conversation.js');

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var defaultMessage, actionMessage;
describe('"public/js/conversation.js"', () => {
  describe('"setMessageToInputOrAction()"', () => {

    before(function() {
       defaultMessage = conversation.setMessageToInputOrAction(1);
       actionMessage = conversation.setMessageToInputOrAction('Action message');
    });

    it('should set return message from user input or as action if parameter is a string', () => {
    assert.typeOf(defaultMessage, 'undefined')
    assert.typeOf(actionMessage, 'string', 'Message identified an action message');
    });
  });
});
