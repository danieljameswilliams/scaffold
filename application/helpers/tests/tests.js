describe('Helpers', function () {
    // Helpers - Partials - Add URL Parameters
    describe('Add URL Parameters', function () {
        it('should add object properties to end of string with ?& characters', require('./partials/_add_url_parameters.js'));
    });

    // Helpers - Partials - Clean Model
    describe('Clean Model', function () {
        it('should return a object with only asked fields', require('./partials/_clean_model.js'));
    });
});