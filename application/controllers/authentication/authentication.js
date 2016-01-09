module.exports = {
    authenticate: {
        manual: require('./partials/_auth_manual.js').authenticate,
        facebook: require('./partials/_auth_facebook.js').authenticate,
        staff: require('./partials/_auth_staff.js').authenticate
    },
    create: {
        manual: require('./partials/_create_manual.js').create,
        staff: require('./partials/_create_staff.js').create
    },
    add: {
        facebook: require('./partials/_add_facebook.js').add
    },
    validate: {
        token: require('./partials/_auth_token.js').validate
    }
};