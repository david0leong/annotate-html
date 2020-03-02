const express = require('express');

const annotationsDataSource = require('../data/annotations');
const annotate = require('../utils/annotate');

const router = express.Router();

router.post('/', function(req, res, next) {
  const annotations = annotationsDataSource.getAll();

  // res.send(annotate(req.body, annotations));
  res.send(
    annotate(req.body, [
      {
        name: 'alex',
        url: 'http://alex.com',
      },
      {
        name: 'bo',
        url: 'http://bo.com',
      },
    ])
  );
});

module.exports = router;
