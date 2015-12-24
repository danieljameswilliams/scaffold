module.exports = {
    connectDatabase: require('./partials/_connect_database.js'),
    getTestUser: require('./partials/_get_test_user.js'),
    getFacebookTestUserAccessToken: require('./partials/_get_facebook_test_user_token.js'),
    cleanModel: require('./partials/_clean_model.js'),
    httpRequest: require('./partials/_http_request.js'),
    addUrlParameters: require('./partials/_add_url_parameters.js')
};