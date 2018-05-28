'use strict';

var feature = require('./../controller/watson_services/feature_conversation.js');
var app = require('./../app.js');
var credentials = require('./../controller/watson_environment.json');

const routePath = "/watson/conversationMessage";
let formattedMessage = {
  input: {
    text: ''
  }
}

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('"feature_conversation.js"', () => {
  describe('Instance returning functions', () => {
    it('should set env params and return an instance of Conversation', () => {
      const conversationInstance = feature.getConversationInstance();

      expect(conversationInstance).to.be.an('object');
    })
    it('should set env params and return an instance of ToneAnalyzer', () => {
      const toneAnalyzer = feature.getToneAnalyzerInstance();

      expect(toneAnalyzer).to.be.an('object');
    })
    it('should return an object with input message and workspace id', () => {
      const message = feature.getMessageWithWorkspaceID('test message');

      expect(message).to.be.an('object');
      expect(message).to.have.property('input');
      expect(message).to.have.property('workspace_id');
    })
  })

  describe('Tone analyzation', () => {
    it('should resolve with an object', async () => {

      formattedMessage.input.text = 'I will be very happy if this feature works!';
      var toneToResolve = feature.getToneAnalyzation(formattedMessage)
        .then((tone) => {
          expect(tone).to.be.an('object');
          expect(tone).to.have.property('document_tone');
        }).catch((err) => {
          console.log("Tone analyzation test: error occured ", error);

        })
    })

    it('should reject with an error', async () => {
      formattedMessage.input.text = '';
      var toneToReject = feature.getToneAnalyzation(formattedMessage).then((_) => {}).catch((error) => {
        expect(error).to.be.an.instanceOf(Error);
      });


    })
  })

  describe('POST /getResponse', () => {
    it('should throw error with status 500', (done) => {
      chai.request(app)
        .post(routePath)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
    it('should return tone analyzation and welcome message from Conversation', (done) => {
      let request = {};
      request.message = "I'm Simon and happy today!";
      chai.request(app)
        .post(routePath).set('content-type', 'application/json')
        .send(request)
        .end((error, response, body) => {

          expect(response.body.response.output.text[0]).to.equal('Nice to meet you, Simon ! And what can I do for you?');
          expect(response.body.tones).to.be.an('object')
          done();
        })
    });
  })
})