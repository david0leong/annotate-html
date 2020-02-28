const express = require("express");

const namesDataSource = require("../data/names");

const router = express.Router();

router.get("/:name", function(req, res, next) {
  const { name } = req.params;
  const url = namesDataSource.getByName(name);

  res.send({ name, url });
});

router.put("/:name", function(req, res, next) {
  const { name } = req.params;
  const { url } = req.body;

  namesDataSource.add(name, url);

  res.send({ name, url });
});

module.exports = router;
