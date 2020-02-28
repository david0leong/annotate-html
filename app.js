const express = require("express");

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;

// middleware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`HTML annotation API server started on: ${port}`);
});
