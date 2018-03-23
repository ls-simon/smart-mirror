'use strict';

var feature = require('./../controller/watson_services/feature_conversation.js');
var app = require('./../app.js');
var credentials = require('./../controller/watson_environment.json');

const routePath = "/watson/conversationMessage";
const stringifiedMessage = JSON.stringify("I will be very happy if this feature works!");

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('"feature_conversation.js"', ()=> {
  describe('Instance returning functions', ()=> {
    it('should set env params and return an instance of Conversation', ()=> {
      const conversationInstance = feature.getConversationInstance();

      expect(conversationInstance).to.be.an('object');
    })
    it('should set env params and return an instance of ToneAnalyzer', ()=> {
      const toneAnalyzer = feature.getToneAnalyzerInstance();

      expect(toneAnalyzer).to.be.an('object');
    })
    it('should return an object with input message and workspace id', ()=> {
      const message = feature.getMessageWithWorkspaceID(stringifiedMessage);

      expect(message).to.be.an('object');
      expect(message).to.have.property('input');
      expect(message).to.have.property('workspace_id');
    })
  })

  describe('Tone analyzation', ()=> {
    it('should resolve with an object', async ()=> {

      const resolvedMessage = {input:{text: stringifiedMessage }, workspace_id: credentials.conversations.workspace};
      const resolvedTone = feature.getToneAnalyzation(resolvedMessage);
      resolvedTone.then(function(data){
        expect(data).to.be.an('object');
        expect(data).to.have.property('document_tone');
      }).catch(function(err){
        console.log("Tone analyzation test: error occured");
        console.log(err);
      })





    })
    it('should reject with an error', async ()=>{
      const emptyMessage = {input:{text: "" }};

      feature.getToneAnalyzation().catch(function(error){

        expect(error).to.be.an.instanceOf(Error);
      });
      feature.getToneAnalyzation(emptyMessage).catch(function(error){

        expect(error).to.be.an.instanceOf(Error);
      })
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
    it('should return tone analyzation and welcome message from Conversation', (done)=>{
      let request = {};
      request.message = "I'm Simon!"
      chai.request(app)
          .post(routePath).set('content-type', 'application/json; charset=utf-8')
            .send(request)
          .end((error, response, body) => {

            expect(response.body.response.output.text[0]).to.equal('Nice to meet you, Simon ! And what can I do for you?');
            expect(response.body.tone).to.be.an('object')
      done();
    })
});
})
})
