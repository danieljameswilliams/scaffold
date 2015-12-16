module.exports = {
    create: {
        manual: require('./partials/_create_manual.js')
    },
    authenticate: {
        facebook: require('./partials/_auth_facebook.js'),
        manual: require('./partials/_auth_manual.js')
    },
    add: {
        facebook: require('./partials/_add_facebook.js')
    }
};