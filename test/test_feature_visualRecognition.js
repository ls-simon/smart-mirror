'use strict';

var feature = require('./../controller/watson_services/feature_visualRecognition.js');
var app = require('./../app.js');
var fs = require('fs');

const routePath = "/watson/classifyImage";

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('"feature_visualRecognition.js"', () => {
  describe('get methods', () => {
    it('should return an instance of VisualRecognitionV3', () => {

      const instance = feature.getInstance();
      expect(instance).to.be.an('object');
    })

    it('should return a classifier options object', () => {

      const options = feature.getOptions();
      expect(options).to.be.an('object');
      expect(options).to.have.property('classifier_ids');
      expect(options).to.have.property('threshold');
    })
  })

  describe('POST /classifyImage', () => {
    it('should find image file from given file path and send image classification', (done) => {

      let request = {};
      request.filePath = "test/images/testImage.jpg";
      assert(fs.existsSync(request.filePath), true, 'file path is valid');

      chai.request(app).post('/watson/classifyImage')
        .set('content-type', 'application/json; charset=utf-8')
        .send(JSON.stringify(request)).end((error, response) => {

          expect(response.body).to.be.an('object');
          expect(response.body.images).to.be.an('Array');
          done();
        });
    })
  })
})