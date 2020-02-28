const express = require('express');

const router = express.Router();

router.post('/', function(req, res, next) {
  console.log('body', req.body);

  res.send(req.body);
});

module.exports = router;
