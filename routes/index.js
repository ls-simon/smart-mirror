var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('index', {
    title: 'Smart Mirror',
    welcomeMsgHeader: 'Hello there sexy!',
    welcomeMsgContent: 'Ask me about something'
  });
});

module.exports = router;