describe('Authentication', function () {
    // Controllers - Authentication - Helpers - Login
    describe('Login Helper', function () {
        it('should return a unique token and a cleaned user object', require('./partials/_login.js'));
    });

    // Controllers - Authentication - Helpers - Create New User
    describe('Create New User Helper', function () {
        it('should return a new user that can then be cleaned like other models and deleted again', require('./partials/_createNewUser.js'));
    });

    // Controllers - Authentication - Add Facebook to existing account
    describe('Add Facebook', function () {
        it('should return status 200 from addFacebook method', require('./partials/_add_facebook.js'));
    });

    // Controllers - Authentication - Authenticate manual user
    describe('Authenticate Manual', function () {
        it('should return a unique token and a cleaned user object', require('./partials/_auth_manual.js'));
    });

    // Controllers - Authentication - Authenticate using Facebook login
    describe('Authenticate Facebook', function () {
        it('should return a unique token and a cleaned user object', require('./partials/_auth_facebook.js'));
    });
});