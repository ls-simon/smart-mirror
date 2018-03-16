'use strict';

const picam = require('./../controller/utils/pi_webcam.js');

const routePath = "/utils/takeSnapshot";
const timestampFormat = /\d{4}-\d{2}-\d{2}_\d+/;
const app = require('./../app');

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('controller/utils/pi_webcam.js', () => {

  describe('takeSnapshotWithTimestamp()', () =>{
    it('should return a timestamp string from picam.sh in correct format', () =>{
      assert(picam.takeSnapshotWithTimestamp.match(timestampFormat), 'snapshot timestamp is valid format');
  })
})

  describe('GET /takeSnapshot', () => {
    it('should run script and return file path', (done) => {
      chai.request(app)
          .get(routePath)
          .end((err, res) => {
              res.should.have.status(200);
              res.should.be.an('object');
              assert(res.body.filePath.match('\.jpg'), 'file path should be a valid format');
            done();
          });
    });
});
});
