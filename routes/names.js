const express = require('express');

const CustomError = require('../utils/error');
const { isNameValid, isUrlValid } = require('../utils/validation');
const annotationsDataSource = require('../data/annotations');

const router = express.Router();

router.get('/:name', function(req, res, next) {
  const { name } = req.params;
  const url = annotationsDataSource.getByName(name);

  if (!url) {
    throw new CustomError(404, 'Name not found');
  }

  res.send({ name, url });
});

router.put('/:name', function(req, res, next) {
  const { name } = req.params;
  const { url } = req.body;

  if (!isNameValid(name)) {
    throw new CustomError(400, 'Invalid name');
  }

  if (!isUrlValid(url)) {
    throw new CustomError(400, 'Invalid url');
  }

  annotationsDataSource.add(name, url);

  res.send({ name, url });
});

router.delete('/', function(req, res, next) {
  annotationsDataSource.deleteAll();

  res.status(204).send();
});

module.exports = router;
