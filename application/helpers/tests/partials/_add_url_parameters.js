var assert = require('assert');

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    try {
        var url = 'http://example.com';
        var parameters = {
            property1: 'hello',
            property2: 'world',
            property3: 'test'
        };

        var result = helpers.addUrlParameters(url, parameters);

        assert.equal(
            'http://example.com?property1=hello&property2=world&property3=test',
            result
        );

        return done();
    }
    catch( error ) {
        return done(error);
    }
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;