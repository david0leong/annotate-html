const express = require('express');
const bodyParser = require('body-parser');

const namesRouter = require('./routes/names');
const annotateRouter = require('./routes/annotate');

const app = express();

const port = process.env.PORT || 3200;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/names', namesRouter);
app.use('/annotate', annotateRouter);

app.listen(port, () => {
  console.log(`HTML annotation API server started on: ${port}`);
});
