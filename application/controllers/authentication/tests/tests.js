describe('Authentication', function () {
    // Controllers - Authentication - Helpers - Login
    describe('Login Helper', function () {
        it('should return a unique token and a cleaned user object', require('./partials/_login.js'));
    });
});