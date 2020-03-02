const cheerio = require('cheerio');

const annotate = (html, annotations) => {
  const $ = cheerio.load(html);

  return $.html();
};

module.exports = annotate;
