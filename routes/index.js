var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', welcomeMsgHeader: 'Hello there sexy!', welcomeMsgContent: 'Ask me about something'});
});
module.exports = router;