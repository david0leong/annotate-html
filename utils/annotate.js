const cheerio = require('cheerio');

const annotateText = (text, annotations = {}) =>
  Object.keys(annotations).reduce(
    (acc, name) =>
      acc.replace(
        new RegExp(`\\b${name}\\b`, 'gi'),
        match => `<a href="${annotations[name]}">${match}</a>`
      ),
    text
  );

const annotate = (html, annotations) => {
  const $ = cheerio.load(html);

  const annotateElement = (el, annotateFn) => {
    if (el.type === 'text') {
      $(el).replaceWith(annotateFn(el.data));
    } else if (el.type === 'tag' && el.name !== 'a') {
      el.children.forEach(childEl => {
        annotateElement(childEl, annotateFn);
      });
    }
  };

  annotateElement($('body')[0], text => annotateText(text, annotations));

  return $('body').html();
};

module.exports = annotate;
