const cheerio = require('cheerio');

const annotateText = (text, annotations) =>
  annotations.reduce(
    (acc, { name, url }) =>
      acc.replace(
        new RegExp(`\\b${name}\\b`, 'gi'),
        match => `<a href="${url}">${match}</a>`
      ),
    text
  );

const annotateElement = (el, annotateFn) => {
  if (el.type === 'text') {
    el.data = annotateFn(el.data);
  } else if (el.type === 'tag' && el.name !== 'a') {
    el.children.forEach(childEl => {
      annotateElement(childEl, annotateFn);
    });
  }
};

const annotate = (html, annotations) => {
  const $ = cheerio.load(html);

  annotateElement($('body')[0], text => annotateText(text, annotations));

  return $.html();
};

module.exports = annotate;
