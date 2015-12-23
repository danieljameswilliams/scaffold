describe('Authentication', function () {
    // Controllers - Authentication - Helpers - Login
    describe('Login Helper', function () {
        it('should return a unique token and a cleaned user object', require('./partials/_login.js'));
    });

    // Controllers - Authentication - Helpers - Create New User
    describe('Create New User Helper', function () {
        it('should return a new user that can then be cleaned like other models and deleted again', require('./partials/_createNewUser.js'));
    });
});