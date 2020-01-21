const signToken = require('./signToken');

//Send token to client when user is logged in.
function loginUserAfterSignup(userId, statusCode, response, status, message, newUser){
    const token = signToken(userId);
    return response.status(statusCode).json({
        status: status,
        message: message,
        token: token,
        data: newUser
    });
}

module.exports = loginUserAfterSignup;