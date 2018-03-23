'use strict';

var feature = require('./../controller/watson_services/feature_textToSpeech.js');
var app = require('./../app.js');
var fs = require('fs');

const textToSpeechRoutePath = "/watson/textToSpeechInput";
const speechToTextRoutePath = "/watson/speechToTextToken";
let filePathRegex;

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);



describe('"feature_textToSpeech.js"', ()=> {

  before(function(){
    filePathRegex = /^public\/audio\/audio\d+\.wav$/;
  })

  describe('get methods', ()=> {

      it('should set env params and return an instance of TextToSpeech', ()=> {
        const textToSpeechInstance = feature.getTextToSpeechInstance();

        expect(textToSpeechInstance).to.be.an('object');
      })

      it('should return an options object with the text to be translated', ()=> {
        const options = feature.getSpeechOptions();

        expect(options).to.be.an('object');
        expect(options).to.have.property('text');
        expect(options).to.have.property('voice');
        expect(options).to.have.property('accept');
      })

      it('should return a valid file path string with a timestamp', ()=> {
        const timeStamp = feature.getFilePathWithTimeStamp();
        expect(timeStamp).to.be.a('string');
        assert(timeStamp.match(filePathRegex), true, 'file path is valid');
      })
  })
  describe('POST /textToSpeechInput', ()=> {
    it('should translate given text and send back a file path to a playable .wav file', (done)=>{
      let request = {};
      request.text = "Nice to meet you!"
      chai.request(app)
          .post(textToSpeechRoutePath)
          .set('content-type', 'application/json; charset=utf-8')
            .send(JSON.stringify(request))
          .end((error, response, body) => {

            expect(response.body.filePath).to.be.a('string');
            assert(response.body.filePath.match(filePathRegex), true, 'response has valid file path');
            assert(fs.existsSync(response.body.filePath), true, '.wav file exists');
      done();
    })
})
  })
  describe('GET /speechToTextToken', ()=> {
    it('should generate and send a token for speech to text translation', (done)=> {
        chai.request(app)
        .get(speechToTextRoutePath)
        .end((error, response)=> {
          expect(response.text).to.be.a('string');
          done();
        })
    })
  })
})
