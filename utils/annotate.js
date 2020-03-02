const cheerio = require('cheerio');

/**
 * Annotate text with annotations map
 *
 * @param {string} text
 * @param {Object} annotations - Annotations map
 *
 * @returns {string}
 *
 * Ex:
 *    annotateText('My name is Alex', { alex: 'http://www.alex.com' }) returns
 *    `My name is <a href="http://alex.com">Alex</a>`
 */
const annotateText = (text, annotations = {}) =>
  Object.keys(annotations).reduce(
    (acc, name) =>
      acc.replace(
        new RegExp(`\\b${name}\\b`, 'gi'),
        match => `<a href="${annotations[name]}">${match}</a>`
      ),
    text
  );

/**
 * Annotate html with annotations map
 *
 * @param {string} html
 * @param {annotations} annotations
 *
 * @returns {string}
 *
 * Ex:
 *    annotateHtml('Alex Alexander <a href="http://foo.com" data-Bo="Bo">Some sentence about Bo</a>', { alex: 'http://www.alex.com', bo: 'http://www.bo.com' }) returns
 *    <a href="http://alex.com">Alex</a> Alexander <a href="http://foo.com" data-bo="Bo">Some sentence about Bo</a>
 */
const annotateHtml = (html, annotations) => {
  const $ = cheerio.load(html, { decodeEntities: false });

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

module.exports = {
  annotateText,
  annotateHtml,
};
