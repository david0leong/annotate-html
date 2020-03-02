const express = require('express');

const annotationsDataSource = require('../data/annotations');
const annotate = require('../utils/annotate');

const router = express.Router();

router.post('/', function(req, res, next) {
  const annotations = annotationsDataSource.getAll();

  res.send(annotate(req.body, annotations));
});

module.exports = router;
