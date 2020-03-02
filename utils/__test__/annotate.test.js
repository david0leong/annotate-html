const { annotateText, annotateHtml } = require('../annotate');

const SIMPLE_ANNOTATIONS = { alex: 'http://alex.com' };
const COMPLEX_ANNOTATIONS = {
  alex: 'http://alex.com',
  bo: 'http://bo.com',
  casey: 'http://casey.com',
};

describe('[Utils] annotate', () => {
  describe('annotateText()', () => {
    it('should annoate simple text', () => {
      expect(annotateText('my name is alex', SIMPLE_ANNOTATIONS)).toEqual(
        'my name is <a href="http://alex.com">alex</a>'
      );

      expect(annotateText('my name is todd', SIMPLE_ANNOTATIONS)).toEqual(
        'my name is todd'
      );
    });

    it('should preserve original case of names', () => {
      expect(annotateText('My name is Alex', SIMPLE_ANNOTATIONS)).toEqual(
        'My name is <a href="http://alex.com">Alex</a>'
      );
    });

    it('should annoate multiple names', () => {
      expect(
        annotateText(
          'alex, bo, and casey went to the park.',
          COMPLEX_ANNOTATIONS
        )
      ).toEqual(
        '<a href="http://alex.com">alex</a>, <a href="http://bo.com">bo</a>, and <a href="http://casey.com">casey</a> went to the park.'
      );

      expect(
        annotateText(
          'alex alexander alexandria alexbocasey',
          COMPLEX_ANNOTATIONS
        )
      ).toEqual(
        '<a href="http://alex.com">alex</a> alexander alexandria alexbocasey'
      );
    });
  });

  describe('annotateHtml()', () => {
    it('should not annotate text under <a> tag', () => {
      expect(
        annotateHtml(
          'Alex Alexander <a href="http://foo.com" data-Bo="Bo">Some sentence about Bo</a>',
          COMPLEX_ANNOTATIONS
        )
      ).toEqual(
        '<a href="http://alex.com">Alex</a> Alexander <a href="http://foo.com" data-bo="Bo">Some sentence about Bo</a>'
      );
    });

    it('should annotate complex example', () => {
      expect(
        annotateHtml(
          '<div class="row"><div class="col-md-6"><h2> Sourcegraph makes programming <strong>delightful.</strong></h2><p>We want to make you even better at what you do best: building software to solve real problems.</p><p>Sourcegraph makes it easier to find the information you need: documentation, examples, usage statistics, answers, and more.</p><p>We\'re just getting started, and we\'d love to hear from you. <a href="/contact" ui-sref="help.contact">Get in touch with us.</a></p></div><div class="col-md-4 team"><h3>Team</h3><ul><li><img src="https://secure.gravatar.com/avatar/c728a3085fc16da7c594903ea8e8858f?s=64" class="pull-left"><div class="bio"><strong>Beyang Liu</strong><br><a target="_blank" href="http://github.com/beyang">github.com/beyang</a><a href="mailto:beyang@sourcegraph.com">beyang@sourcegraph.com</a></div></li><li><img src="https://secure.gravatar.com/avatar/d491971c742b8249341e495cf53045ea?s=64" class="pull-left"><div class="bio"><strong>Quinn Slack</strong><br><a target="_blank" href="http://github.com/sqs">github.com/sqs</a><a href="mailto:sqs@sourcegraph.com">sqs@sourcegraph.com</a></div></li><li><img src="https://s3-us-west-2.amazonaws.com/public-dev/milton.png" class="pull-left"><div class="bio"><strong>Milton</strong> the Australian Shepherd </div></li></ul><p><a href="/contact" ui-sref="help.contact">Want to join us?</a></p></div></div>',
          {
            Sourcegraph: 'https://sourcegraph.com',
            Milton: 'https://www.google.com/search?q=milton',
            strong: 'https://www.google.com/search?q=strong',
          }
        )
      ).toEqual(
        `<div class="row"><div class="col-md-6"><h2> <a href="https://sourcegraph.com">Sourcegraph</a> makes programming <strong>delightful.</strong></h2><p>We want to make you even better at what you do best: building software to solve real problems.</p><p><a href="https://sourcegraph.com">Sourcegraph</a> makes it easier to find the information you need: documentation, examples, usage statistics, answers, and more.</p><p>We're just getting started, and we'd love to hear from you. <a href="/contact" ui-sref="help.contact">Get in touch with us.</a></p></div><div class="col-md-4 team"><h3>Team</h3><ul><li><img src="https://secure.gravatar.com/avatar/c728a3085fc16da7c594903ea8e8858f?s=64" class="pull-left"><div class="bio"><strong>Beyang Liu</strong><br><a target="_blank" href="http://github.com/beyang">github.com/beyang</a><a href="mailto:beyang@sourcegraph.com">beyang@sourcegraph.com</a></div></li><li><img src="https://secure.gravatar.com/avatar/d491971c742b8249341e495cf53045ea?s=64" class="pull-left"><div class="bio"><strong>Quinn Slack</strong><br><a target="_blank" href="http://github.com/sqs">github.com/sqs</a><a href="mailto:sqs@sourcegraph.com">sqs@sourcegraph.com</a></div></li><li><img src="https://s3-us-west-2.amazonaws.com/public-dev/milton.png" class="pull-left"><div class="bio"><strong><a href="https://www.google.com/search?q=milton">Milton</a></strong> the Australian Shepherd </div></li></ul><p><a href="/contact" ui-sref="help.contact">Want to join us?</a></p></div></div>`
      );
    });

    it('should handle tricky case', () => {
      expect(
        annotateHtml(`<div class='<div class="name">name</a>'>name</div>`, {
          name: 'https://name.com',
        })
      ).toEqual(
        '<div class="<div class="name">name</a>"><a href="https://name.com">name</a></div>'
      );
    });
  });
});
