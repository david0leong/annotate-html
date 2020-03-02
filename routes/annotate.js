const express = require('express');

const annotationsDataSource = require('../data/annotations');
const { annotateHtml } = require('../utils/annotate');

const router = express.Router();

router.post('/', function(req, res, next) {
  const annotations = annotationsDataSource.getAll();

  res.send(annotateHtml(req.body, annotations));
});

module.exports = router;
