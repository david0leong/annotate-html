#!/bin/bash

# How to run this script:
#
# 0. Make sure Python and html5lib (https://pypi.python.org/pypi/html5lib) are installed. This script will not work without them.
# 1. Run your server
# 2. Set $HOST and $PORT below accordingly
# 3. %> ./test.sh

HOST=localhost                  # name of HOST at which your server is running
PORT=3000                       # PORT on which your server is listening

OUT=out.txt                     # output file this script will write to
EXP=expected_out.txt            # file that contains expected contents of the output file after this script is run

formatHTML() {
    read input
    echo $input | /usr/local/bin/python3 -c "import html5lib as h5; import sys; sys.stdout.write(h5.serialize(h5.parse(sys.stdin.read())))"
}

rm -f $OUT
touch $OUT

echo >> $OUT
echo '=== Test create, fetch, update ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.com" }'
curl -XGET "http://$HOST:$PORT/names/alex" >> $OUT
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.org" }'
curl -XGET "http://$HOST:$PORT/names/alex" >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -XGET "http://$HOST:$PORT/names/alex" -s -o /dev/null -w 'HTTP status code: %{http_code}\n' >> $OUT

echo >> $OUT
echo '=== Test simple annotation ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.com" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d 'my name is alex' | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d 'my name is todd' | formatHTML >> $OUT

echo >> $OUT
echo '=== Test annotation of multiple names ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.com" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/bo" -d '{ "url": "http://bo.com" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/casey" -d '{ "url": "http://casey.com" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d 'alex, bo, and casey went to the park.' | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d 'alex alexander alexandria alexbocasey' | formatHTML >> $OUT

echo >> $OUT
echo '=== Test HTML correctness ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.com" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d '<div data-alex="alex">alex</div>' | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d '<a href="http://foo.com">alex is already linked</a> but alex is not' | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d "<div><p>this is paragraph 1 about alex.</p><p>alex's paragraph number 2.</p><p>and some closing remarks about alex</p></div>" | formatHTML >> $OUT

echo >> $OUT
echo '=== Test additional annotations ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/alex" -d '{ "url": "http://alex.com" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/bo" -d '{ "url": "http://bo.com" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/casey" -d '{ "url": "http://casey.com" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d '<div data-alex="alex">alex</div>' | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d "<div><p>this is paragraph 1 about alex.</p><p>alex's paragraph number 2.</p><p>and some closing remarks about alex</p></div>" | formatHTML >> $OUT
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d "<div><ul><li>alex</li><li>bo</li><li>bob</li><li>casey</li></ul></div><div><p>this is paragraph 1 about alex.</p><p>alex's paragraph number 2.</p><p>and some closing remarks about alex</p></div>" | formatHTML >> $OUT

echo >> $OUT
echo '=== Test annotation of complex example ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/Sourcegraph" -d '{ "url": "https://sourcegraph.com" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/Milton" -d '{ "url": "https://www.google.com/search?q=milton" }'
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/strong" -d '{ "url": "https://www.google.com/search?q=strong" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d "<div class=\"row\"><div class=\"col-md-6\"><h2> Sourcegraph makes programming <strong>delightful.</strong></h2><p>We want to make you even better at what you do best: building software to solve real problems.</p><p>Sourcegraph makes it easier to find the information you need: documentation, examples, usage statistics, answers, and more.</p><p>We're just getting started, and we'd love to hear from you. <a href=\"/contact\" ui-sref=\"help.contact\">Get in touch with us.</a></p></div><div class=\"col-md-4 team\"><h3>Team</h3><ul><li><img src=\"https://secure.gravatar.com/avatar/c728a3085fc16da7c594903ea8e8858f?s=64\" class=\"pull-left\"><div class=\"bio\"><strong>Beyang Liu</strong><br><a target=\"_blank\" href=\"http://github.com/beyang\">github.com/beyang</a><a href=\"mailto:beyang@sourcegraph.com\">beyang@sourcegraph.com</a></div></li><li><img src=\"https://secure.gravatar.com/avatar/d491971c742b8249341e495cf53045ea?s=64\" class=\"pull-left\"><div class=\"bio\"><strong>Quinn Slack</strong><br><a target=\"_blank\" href=\"http://github.com/sqs\">github.com/sqs</a><a href=\"mailto:sqs@sourcegraph.com\">sqs@sourcegraph.com</a></div></li><li><img src=\"https://s3-us-west-2.amazonaws.com/public-dev/milton.png\" class=\"pull-left\"><div class=\"bio\"><strong>Milton</strong> the Australian Shepherd </div></li></ul><p><a href=\"/contact\" ui-sref=\"help.contact\">Want to join us?</a></p></div></div>" | formatHTML >> $OUT

echo >> $OUT
echo '=== Tricky case ===' >> $OUT
curl -XDELETE "http://$HOST:$PORT/names"
curl -H 'Content-Type:application/json' -XPUT "http://$HOST:$PORT/names/name" -d '{ "url": "https://name.com" }'
curl -H 'Content-Type:text/plain' -XPOST "http://$HOST:$PORT/annotate" -d "<div class='<div class=\"name\">name</a>'>name</div>" | formatHTML >> $OUT

DIFF=$(diff --unified --ignore-case $EXP $OUT)
echo ''
if [ "" == "$DIFF" ]; then
    echo '####################################'
    echo '#          RESULT: success         #'
    echo '####################################'
else
    echo '####################################'
    echo '#           TEST ERRORS:           #'
    echo '####################################'
    diff --unified --ignore-case $EXP $OUT
fi
